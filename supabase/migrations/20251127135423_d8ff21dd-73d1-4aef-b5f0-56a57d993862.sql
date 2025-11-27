-- Create a public function to get dashboard statistics
-- This function can be called by unauthenticated users and returns aggregate counts
CREATE OR REPLACE FUNCTION public.get_public_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  active_count INTEGER;
  resolved_count INTEGER;
  students_count INTEGER;
BEGIN
  -- Count active tickets (status not 'merged')
  SELECT COUNT(*) INTO active_count 
  FROM tickets 
  WHERE status != 'merged';
  
  -- Count resolved tickets (status = 'merged')
  SELECT COUNT(*) INTO resolved_count 
  FROM tickets 
  WHERE status = 'merged';
  
  -- Count students
  SELECT COUNT(*) INTO students_count 
  FROM user_roles 
  WHERE role = 'student';
  
  -- Return as JSON object
  RETURN json_build_object(
    'active_issues', COALESCE(active_count, 0),
    'resolved_issues', COALESCE(resolved_count, 0),
    'students', COALESCE(students_count, 0)
  );
END;
$$;