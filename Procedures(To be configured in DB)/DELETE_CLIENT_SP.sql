create or replace PROCEDURE DELETE_CLIENT_SP (
    p_clientno IN dh_client.clientno%TYPE
) IS
BEGIN
    DELETE FROM DH_CLIENT
    WHERE CLIENTNO = p_clientno;
    COMMIT;
END DELETE_CLIENT_SP; 