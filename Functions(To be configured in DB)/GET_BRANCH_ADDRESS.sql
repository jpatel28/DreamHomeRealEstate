create or replace FUNCTION GET_BRANCH_ADDRESS (
    p_branchno IN VARCHAR2
) RETURN VARCHAR2
IS
    v_address VARCHAR2(200);
BEGIN
    SELECT street || ', ' || city
    INTO v_address
    FROM dh_branch
    WHERE branchno = p_branchno;

    RETURN v_address;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN 'Branch not found';
    WHEN OTHERS THEN
        RETURN 'Error retrieving branch address';
END GET_BRANCH_ADDRESS;