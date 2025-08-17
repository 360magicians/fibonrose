-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types
CREATE TYPE user_type AS ENUM ('interpreter', 'deaf_professional', 'service_provider', 'admin');
CREATE TYPE verification_status AS ENUM ('pending', 'in_progress', 'approved', 'rejected', 'expired');
CREATE TYPE trust_level AS ENUM ('unverified', 'bronze', 'silver', 'gold', 'platinum');
CREATE TYPE asl_proficiency AS ENUM ('beginner', 'intermediate', 'advanced', 'native');
CREATE TYPE service_type AS ENUM ('real_estate', 'tax_preparation', 'insurance', 'financial_planning');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    user_type user_type NOT NULL,
    phone TEXT,
    video_phone TEXT,
    preferred_contact TEXT DEFAULT 'email',
    profile_image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interpreter profiles
CREATE TABLE public.interpreter_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    asl_proficiency asl_proficiency NOT NULL,
    years_experience INTEGER NOT NULL DEFAULT 0,
    specializations TEXT[] DEFAULT '{}',
    certifications JSONB DEFAULT '[]',
    languages TEXT[] DEFAULT '{"ASL", "English"}',
    service_areas TEXT[] DEFAULT '{}',
    hourly_rate DECIMAL(10,2),
    availability JSONB DEFAULT '{}',
    bio TEXT,
    website_url TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deaf professional profiles
CREATE TABLE public.deaf_professional_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    asl_proficiency asl_proficiency NOT NULL DEFAULT 'native',
    deaf_community_involvement JSONB DEFAULT '[]',
    volunteer_experience JSONB DEFAULT '[]',
    leadership_roles JSONB DEFAULT '[]',
    skills TEXT[] DEFAULT '{}',
    education JSONB DEFAULT '[]',
    work_experience JSONB DEFAULT '[]',
    portfolio_url TEXT,
    resume_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trust scores
CREATE TABLE public.trust_scores (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    overall_score INTEGER NOT NULL DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 100),
    skills_proficiency INTEGER NOT NULL DEFAULT 0 CHECK (skills_proficiency >= 0 AND skills_proficiency <= 40),
    experience_verification INTEGER NOT NULL DEFAULT 0 CHECK (experience_verification >= 0 AND experience_verification <= 25),
    community_standing INTEGER NOT NULL DEFAULT 0 CHECK (community_standing >= 0 AND community_standing <= 20),
    performance_rating INTEGER NOT NULL DEFAULT 0 CHECK (performance_rating >= 0 AND performance_rating <= 15),
    trust_level trust_level NOT NULL DEFAULT 'unverified',
    last_calculated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Verification requests
CREATE TABLE public.verification_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    request_type TEXT NOT NULL,
    status verification_status NOT NULL DEFAULT 'pending',
    submitted_documents JSONB DEFAULT '[]',
    reviewer_id UUID REFERENCES public.users(id),
    reviewer_notes TEXT,
    verification_data JSONB DEFAULT '{}',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community feedback and ratings
CREATE TABLE public.community_feedback (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reviewer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    reviewee_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    service_type service_type,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    cultural_competency_rating INTEGER CHECK (cultural_competency_rating >= 1 AND cultural_competency_rating <= 5),
    communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
    professionalism_rating INTEGER CHECK (professionalism_rating >= 1 AND professionalism_rating <= 5),
    would_recommend BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    service_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT no_self_review CHECK (reviewer_id != reviewee_id)
);

-- Service bookings
CREATE TABLE public.service_bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    interpreter_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    service_provider_id UUID REFERENCES public.users(id),
    service_type service_type NOT NULL,
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    location TEXT,
    is_remote BOOLEAN DEFAULT false,
    special_requirements TEXT,
    status TEXT NOT NULL DEFAULT 'scheduled',
    total_cost DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit log for trust score changes
CREATE TABLE public.trust_score_audit (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    old_score INTEGER,
    new_score INTEGER,
    old_trust_level trust_level,
    new_trust_level trust_level,
    change_reason TEXT NOT NULL,
    changed_by UUID REFERENCES public.users(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_user_type ON public.users(user_type);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_trust_scores_user_id ON public.trust_scores(user_id);
CREATE INDEX idx_trust_scores_trust_level ON public.trust_scores(trust_level);
CREATE INDEX idx_verification_requests_user_id ON public.verification_requests(user_id);
CREATE INDEX idx_verification_requests_status ON public.verification_requests(status);
CREATE INDEX idx_community_feedback_reviewee_id ON public.community_feedback(reviewee_id);
CREATE INDEX idx_service_bookings_interpreter_id ON public.service_bookings(interpreter_id);
CREATE INDEX idx_service_bookings_appointment_date ON public.service_bookings(appointment_date);
