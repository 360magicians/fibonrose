-- Function to calculate trust score
CREATE OR REPLACE FUNCTION calculate_trust_score(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    skills_score INTEGER := 0;
    experience_score INTEGER := 0;
    community_score INTEGER := 0;
    performance_score INTEGER := 0;
    total_score INTEGER := 0;
    user_type_val user_type;
BEGIN
    -- Get user type
    SELECT u.user_type INTO user_type_val
    FROM public.users u
    WHERE u.id = user_uuid;

    -- Calculate skills proficiency (max 40 points)
    IF user_type_val = 'interpreter' THEN
        SELECT 
            CASE 
                WHEN ip.asl_proficiency = 'native' THEN 40
                WHEN ip.asl_proficiency = 'advanced' THEN 30
                WHEN ip.asl_proficiency = 'intermediate' THEN 20
                ELSE 10
            END INTO skills_score
        FROM public.interpreter_profiles ip
        WHERE ip.user_id = user_uuid;
    ELSE
        skills_score := 35; -- Default high score for deaf professionals
    END IF;

    -- Calculate experience verification (max 25 points)
    SELECT 
        CASE 
            WHEN COUNT(*) >= 5 THEN 25
            WHEN COUNT(*) >= 3 THEN 20
            WHEN COUNT(*) >= 1 THEN 15
            ELSE 5
        END INTO experience_score
    FROM public.verification_requests vr
    WHERE vr.user_id = user_uuid AND vr.status = 'approved';

    -- Calculate community standing (max 20 points)
    SELECT 
        CASE 
            WHEN AVG(cf.rating) >= 4.5 THEN 20
            WHEN AVG(cf.rating) >= 4.0 THEN 16
            WHEN AVG(cf.rating) >= 3.5 THEN 12
            WHEN AVG(cf.rating) >= 3.0 THEN 8
            ELSE 4
        END INTO community_score
    FROM public.community_feedback cf
    WHERE cf.reviewee_id = user_uuid AND cf.is_verified = true;

    -- Calculate performance rating (max 15 points)
    SELECT 
        CASE 
            WHEN COUNT(*) >= 10 AND AVG(cf.rating) >= 4.5 THEN 15
            WHEN COUNT(*) >= 5 AND AVG(cf.rating) >= 4.0 THEN 12
            WHEN COUNT(*) >= 3 AND AVG(cf.rating) >= 3.5 THEN 9
            WHEN COUNT(*) >= 1 THEN 6
            ELSE 3
        END INTO performance_score
    FROM public.community_feedback cf
    WHERE cf.reviewee_id = user_uuid AND cf.is_verified = true;

    -- Calculate total score
    total_score := COALESCE(skills_score, 0) + COALESCE(experience_score, 0) + 
                   COALESCE(community_score, 0) + COALESCE(performance_score, 0);

    -- Update trust scores table
    INSERT INTO public.trust_scores (
        user_id, overall_score, skills_proficiency, experience_verification,
        community_standing, performance_rating, trust_level, last_calculated, expires_at
    ) VALUES (
        user_uuid, total_score, COALESCE(skills_score, 0), COALESCE(experience_score, 0),
        COALESCE(community_score, 0), COALESCE(performance_score, 0),
        CASE 
            WHEN total_score >= 90 THEN 'platinum'::trust_level
            WHEN total_score >= 80 THEN 'gold'::trust_level
            WHEN total_score >= 70 THEN 'silver'::trust_level
            WHEN total_score >= 60 THEN 'bronze'::trust_level
            ELSE 'unverified'::trust_level
        END,
        NOW(),
        NOW() + INTERVAL '1 year'
    )
    ON CONFLICT (user_id) DO UPDATE SET
        overall_score = EXCLUDED.overall_score,
        skills_proficiency = EXCLUDED.skills_proficiency,
        experience_verification = EXCLUDED.experience_verification,
        community_standing = EXCLUDED.community_standing,
        performance_rating = EXCLUDED.performance_rating,
        trust_level = EXCLUDED.trust_level,
        last_calculated = EXCLUDED.last_calculated,
        expires_at = EXCLUDED.expires_at,
        updated_at = NOW();

    RETURN total_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get available interpreters by service type and location
CREATE OR REPLACE FUNCTION get_available_interpreters(
    service_type_param service_type,
    location_param TEXT DEFAULT NULL,
    min_trust_level trust_level DEFAULT 'bronze'
)
RETURNS TABLE (
    user_id UUID,
    full_name TEXT,
    email TEXT,
    asl_proficiency asl_proficiency,
    trust_level trust_level,
    overall_score INTEGER,
    hourly_rate DECIMAL,
    average_rating DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.full_name,
        u.email,
        ip.asl_proficiency,
        ts.trust_level,
        ts.overall_score,
        ip.hourly_rate,
        COALESCE(AVG(cf.rating), 0) as average_rating
    FROM public.users u
    JOIN public.interpreter_profiles ip ON u.id = ip.user_id
    JOIN public.trust_scores ts ON u.id = ts.user_id
    LEFT JOIN public.community_feedback cf ON u.id = cf.reviewee_id AND cf.is_verified = true
    WHERE 
        u.user_type = 'interpreter'
        AND u.is_active = true
        AND ts.trust_level >= min_trust_level
        AND ts.expires_at > NOW()
        AND (location_param IS NULL OR location_param = ANY(ip.service_areas))
    GROUP BY u.id, u.full_name, u.email, ip.asl_proficiency, ts.trust_level, ts.overall_score, ip.hourly_rate
    ORDER BY ts.overall_score DESC, average_rating DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
