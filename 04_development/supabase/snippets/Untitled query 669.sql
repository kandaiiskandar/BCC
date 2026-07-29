SELECT p.name 
FROM user_project_assignments upa
JOIN projects p ON p.id = upa.project_id
WHERE upa.user_id = '22222222-2222-2222-2222-222222222222';