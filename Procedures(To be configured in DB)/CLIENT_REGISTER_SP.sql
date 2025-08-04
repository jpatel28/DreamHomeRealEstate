create or replace PROCEDURE CLIENT_REGISTER_SP (
    p_clientno IN dh_client.clientno%TYPE,
    p_fname IN dh_client.fname%TYPE,
    p_lname IN dh_client.lname%TYPE,
    p_telno IN dh_client.telno%TYPE,
    p_street IN dh_client.street%TYPE,
    p_city IN dh_client.city%TYPE,
    p_email IN dh_client.email%TYPE,
    p_preftype IN dh_client.preftype%TYPE,
    p_maxrent IN dh_client.maxrent%TYPE
) IS
BEGIN
    INSERT INTO dh_client (CLIENTNO, FNAME, LNAME, TELNO, STREET, CITY, EMAIL, PREFTYPE, MAXRENT)
    VALUES (p_clientno, p_fname, p_lname, p_telno, p_street, p_city, p_email, p_preftype, p_maxrent);
    COMMIT;
END CLIENT_REGISTER_SP;
