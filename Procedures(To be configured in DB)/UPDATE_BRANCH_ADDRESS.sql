create or replace PROCEDURE UPDATE_BRANCH_ADDRESS (
    p_branchno IN VARCHAR2,
    p_street   IN VARCHAR2,
    p_city     IN VARCHAR2,
    p_postcode IN VARCHAR2
)
IS
BEGIN
    UPDATE dh_branch
    SET street   = p_street,
        city     = p_city,
        postcode = p_postcode
    WHERE branchno = p_branchno;

    IF SQL%ROWCOUNT = 0 THEN
        DBMS_OUTPUT.PUT_LINE('No branch found with ID ' || p_branchno);
    ELSE
        DBMS_OUTPUT.PUT_LINE('Branch ' || p_branchno || ' updated successfully.');
    END IF;

    COMMIT;
END UPDATE_BRANCH_ADDRESS;