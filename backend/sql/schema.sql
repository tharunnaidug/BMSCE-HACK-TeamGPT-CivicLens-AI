CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE complaints (
    id SERIAL PRIMARY KEY,

    user_id INTEGER REFERENCES users(id),

    title VARCHAR(255),

    description TEXT,

    ai_label VARCHAR(100),

    custom_label VARCHAR(100),

    image_url TEXT NOT NULL,

    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,

    location GEOGRAPHY(Point, 4326),

    status VARCHAR(50) DEFAULT 'pending',

    severity VARCHAR(20) DEFAULT 'medium',

    complaint_count INTEGER DEFAULT 1,

    admin_response TEXT,

    resolved_image_url TEXT,

    assigned_to INTEGER REFERENCES users(id),

    is_duplicate BOOLEAN DEFAULT FALSE,

    is_deleted BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE complaint_updates (
    id SERIAL PRIMARY KEY,

    complaint_id INTEGER REFERENCES complaints(id),

    updated_by INTEGER REFERENCES users(id),

    old_status VARCHAR(50),

    new_status VARCHAR(50),

    remarks TEXT,

    proof_image TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);