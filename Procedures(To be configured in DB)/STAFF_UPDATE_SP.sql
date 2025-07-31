create or replace PROCEDURE STAFF_UPDATE_SP (
    p_staffno IN dh_staff.staffno%TYPE,
    p_new_salary IN dh_staff.salary%TYPE,
    p_new_telephone IN dh_staff.telephone%TYPE,
    p_new_mobile IN dh_staff.mobile%TYPE,
    p_new_email IN dh_staff.email%TYPE
) IS 
BEGIN
    UPDATE DH_STAFF
    SET
        SALARY = p_new_salary,
        TELEPHONE = p_new_telephone,
        MOBILE = p_new_mobile,
        EMAIL = p_new_email
    WHERE STAFFNO = p_staffno;
    COMMIT;
END STAFF_UPDATE_SP;