from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from ultralytics import YOLO

import shutil
import os
import math

app = FastAPI()

# =========================================
# CORS
# =========================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================
# LOAD MODEL
# =========================================
model = YOLO("best.pt")

# =========================================
# UPLOAD FOLDER
# =========================================
UPLOAD_FOLDER = "app/uploads"

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

# =========================================
# TEMP MEMORY STORAGE
# (Later move to PostgreSQL)
# =========================================
reported_issues = []

# =========================================
# DISTANCE FUNCTION
# =========================================
def get_distance_meters(
    lat1,
    lon1,
    lat2,
    lon2
):

    R = 6371000

    dLat = math.radians(
        lat2 - lat1
    )

    dLon = math.radians(
        lon2 - lon1
    )

    a = (
        math.sin(dLat / 2)
        * math.sin(dLat / 2)
        +
        math.cos(
            math.radians(lat1)
        )
        *
        math.cos(
            math.radians(lat2)
        )
        *
        math.sin(dLon / 2)
        *
        math.sin(dLon / 2)
    )

    c = (
        2 *
        math.atan2(
            math.sqrt(a),
            math.sqrt(1 - a)
        )
    )

    return R * c

# =========================================
# HOME
# =========================================
@app.get("/")
def home():

    return {

        "message":
            "AI Service Running"
    }

# =========================================
# DETECT
# =========================================
@app.post("/detect")
async def detect(

    file: UploadFile = File(...),

    latitude: float = 0,

    longitude: float = 0,
):

    try:

        # =========================================
        # SAVE IMAGE
        # =========================================
        file_path = (
            f"{UPLOAD_FOLDER}/"
            f"{file.filename}"
        )

        with open(
            file_path,
            "wb"
        ) as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )

        # =========================================
        # RUN YOLO
        # =========================================
        results = model(file_path)

        detections = []

        for result in results:

            boxes = result.boxes

            for box in boxes:

                cls_id = int(
                    box.cls[0]
                )

                conf = float(
                    box.conf[0]
                )

                class_name = (
                    model.names[cls_id]
                )

                detections.append({

                    "class_id":
                        cls_id,

                    "class_name":
                        class_name,

                    "confidence":
                        round(conf, 2)
                })

        # =========================================
        # NO DETECTION
        # =========================================
        if len(detections) == 0:

            return {

                "success": False,

                "message":
                    "No issue detected",

                "manual_entry":
                    True
            }

        # =========================================
        # FIRST DETECTION
        # =========================================
        detection = detections[0]

        detected_class = (
            detection["class_name"]
        )

        # =========================================
        # DUPLICATE CHECK
        # =========================================
        duplicate = False

        nearby_distance = None

        for issue in reported_issues:

            distance = (
                get_distance_meters(

                    latitude,
                    longitude,

                    issue["latitude"],
                    issue["longitude"]
                )
            )

            # Within 10 meters
            if distance <= 10:

                duplicate = True

                nearby_distance = round(
                    distance,
                    2
                )

                break

        # =========================================
        # POINTS SYSTEM
        # =========================================
        if duplicate:

            points = 5

        else:

            points = 10

        # =========================================
        # SAVE MEMORY
        # =========================================
        reported_issues.append({

            "class_name":
                detected_class,

            "latitude":
                latitude,

            "longitude":
                longitude,
        })

        # =========================================
        # RESPONSE
        # =========================================
        return {

            "success": True,

            "image":
                file.filename,

            "detections":
                detections,

            "duplicate_report":
                duplicate,

            "nearby_distance":
                nearby_distance,

            "points_earned":
                points,

            "message":
                (
                    "Duplicate issue detected"
                    if duplicate
                    else
                    "New issue detected"
                )
        }

    except Exception as e:

        return {

            "success": False,

            "error":
                str(e)
        }