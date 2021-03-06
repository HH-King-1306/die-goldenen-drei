<?php
session_start();


require_once("inc/config.php.inc");
require_once("inc/functions.php");

$error_msg = "";
if (isset($_POST['email']) && isset($_POST['passwort'])) {
    $email = $_POST['email'];
    $passwort = $_POST['passwort'];

    $statement = $pdo->prepare("SELECT * FROM users WHERE email = :email");
    $result = $statement->execute(array('email' => $email));
    $user = $statement->fetch();

    //Überprüfung des Passworts
    if ($user !== false && password_verify($passwort, $user['passwort'])) {
        $_SESSION['userid'] = $user['id'];
        //Möchte der Nutzer angemeldet beleiben?
        if (isset($_POST['angemeldet_bleiben'])) {
            $identifier = random_string();
            $securitytoken = random_string();

            $insert = $pdo->prepare("INSERT INTO securitytokens (user_id, identifier, securitytoken) VALUES (:user_id, :identifier, :securitytoken)");
            $insert->execute(array('user_id' => $user['id'], 'identifier' => $identifier, 'securitytoken' => sha1($securitytoken)));
            setcookie("identifier", $identifier, time() + (3600 * 24 * 365)); //Valid for 1 year
            setcookie("securitytoken", $securitytoken, time() + (3600 * 24 * 365)); //Valid for 1 year
        }
        header("location: overview.php");
        exit;
    } else {
        $error_msg = "E-Mail oder Passwort war ungültig<br><br>";
    }
}

$email_value = "";
if (isset($_POST['email']))
    $email_value = htmlentities($_POST['email']);
include("templates/header.php");
?>


<?php
include("templates/footer.php")
?>