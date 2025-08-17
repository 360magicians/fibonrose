-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interpreter_profiles_updated_at BEFORE UPDATE ON public.interpreter_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deaf_professional_profiles_updated_at BEFORE UPDATE ON public.deaf_professional_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trust_scores_updated_at BEFORE UPDATE ON public.trust_scores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_verification_requests_updated_at BEFORE UPDATE ON public.verification_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_feedback_updated_at BEFORE UPDATE ON public.community_feedback
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_bookings_updated_at BEFORE UPDATE ON public.service_bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to audit trust score changes
CREATE OR REPLACE FUNCTION audit_trust_score_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.overall_score != NEW.overall_score OR OLD.trust_level != NEW.trust_level THEN
        INSERT INTO public.trust_score_audit (
            user_id, old_score, new_score, old_trust_level, new_trust_level,
            change_reason, changed_by, metadata
        ) VALUES (
            NEW.user_id, OLD.overall_score, NEW.overall_score,
            OLD.trust_level, NEW.trust_level,
            'Automatic recalculation', auth.uid(),
            jsonb_build_object(
                'old_skills', OLD.skills_proficiency,
                'new_skills', NEW.skills_proficiency,
                'old_experience', OLD.experience_verification,
                'new_experience', NEW.experience_verification,
                'old_community', OLD.community_standing,
                'new_community', NEW.community_standing,
                'old_performance', OLD.performance_rating,
                'new_performance', NEW.performance_rating
            )
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER audit_trust_score_changes_trigger
    AFTER UPDATE ON public.trust_scores
    FOR EACH ROW EXECUTE FUNCTION audit_trust_score_changes();
