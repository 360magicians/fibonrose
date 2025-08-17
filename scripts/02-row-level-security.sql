-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interpreter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deaf_professional_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_score_audit ENABLE ROW LEVEL SECURITY;

-- Users can read their own data and public profiles
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Public can view verified interpreter profiles
CREATE POLICY "Public can view verified interpreters" ON public.interpreter_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.trust_scores ts 
            WHERE ts.user_id = interpreter_profiles.user_id 
            AND ts.trust_level != 'unverified'
        )
    );

-- Users can manage their own profiles
CREATE POLICY "Users can manage own interpreter profile" ON public.interpreter_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() 
            AND u.id = interpreter_profiles.user_id
        )
    );

CREATE POLICY "Users can manage own deaf professional profile" ON public.deaf_professional_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() 
            AND u.id = deaf_professional_profiles.user_id
        )
    );

-- Trust scores are readable by profile owners and admins
CREATE POLICY "Users can view own trust scores" ON public.trust_scores
    FOR SELECT USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() 
            AND u.user_type = 'admin'
        )
    );

-- Community feedback policies
CREATE POLICY "Users can create feedback" ON public.community_feedback
    FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can view feedback about them" ON public.community_feedback
    FOR SELECT USING (
        auth.uid() = reviewee_id OR 
        auth.uid() = reviewer_id OR
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() 
            AND u.user_type = 'admin'
        )
    );

-- Service booking policies
CREATE POLICY "Users can manage their bookings" ON public.service_bookings
    FOR ALL USING (
        auth.uid() = client_id OR 
        auth.uid() = interpreter_id OR 
        auth.uid() = service_provider_id
    );
