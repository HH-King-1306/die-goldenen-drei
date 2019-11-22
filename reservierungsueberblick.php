<?php
session_start();
require_once("inc/config.php.inc");
require_once("inc/functions.php");

//Überprüfe, dass der User eingeloggt ist
//Der Aufruf von check_user() muss in alle internen Seiten eingebaut sein
//Mit der If-Abfrage überprüfen ob der User Adminrechte hat und entsprechend den Adminheader miteinbinden

$user = check_user();
if ($user['admin'] == true) {
    include_once("./admin/header.php");
} else {
    include_once("templates/header.php");
}
?>
<div class="mainContainer">
    <div class="reservierungForm">

        <h1>Reservierung</h1>
        <?php
        $showFormular = true; //Variable ob das Reservierungsformular anezeigt werden soll

        if (isset($_GET['register'])) {
            $error = false;
            $vorname = trim($_POST['vorname']);
            $nachname = trim($_POST['nachname']);
            $email = trim($_POST['email']);
            $passwort = $_POST['passwort'];
            $passwort2 = $_POST['passwort2'];

            if (empty($vorname) || empty($nachname) || empty($email)) {
                echo 'Bitte alle Felder ausfüllen<br>';
                $error = true;
            }

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                echo 'Bitte eine gültige E-Mail-Adresse eingeben<br>';
                $error = true;
            }
            if (strlen($passwort) == 0) {
                echo 'Bitte ein Passwort angeben<br>';
                $error = true;
            }
            if ($passwort != $passwort2) {
                echo 'Die Passwörter müssen übereinstimmen<br>';
                $error = true;
            }

            //Überprüfe, dass die E-Mail-Adresse noch nicht registriert wurde
            if (!$error) {
                $statement = $pdo->prepare("SELECT * FROM reservierung WHERE email = :email");
                $result = $statement->execute(array('email' => $email));
                $user = $statement->fetch();

                if ($user !== false) {
                    echo 'Diese E-Mail-Adresse ist bereits vergeben<br>';
                    $error = true;
                }
            }

            //Keine Fehler, wir können den Nutzer registrieren
            if (!$error) {
                $passwort_hash = password_hash($passwort, PASSWORD_DEFAULT);

                $statement = $pdo->prepare("INSERT INTO users (email, passwort, vorname, nachname) VALUES (:email, :passwort, :vorname, :nachname)");
                $result = $statement->execute(array('email' => $email, 'passwort' => $passwort_hash, 'vorname' => $vorname, 'nachname' => $nachname));

                if ($result) {
                    echo 'Du wurdest erfolgreich registriert. <a href="login.php">Zum Login</a>';
                    $showFormular = false;
                } else {
                    echo 'Beim Abspeichern ist leider ein Fehler aufgetreten<br>';
                }
            }
        }

        //if ($showFormular) {
        ?>

        <form action="?register=3" method="post">

            <div class="form-group">
                <label for="inputZimmerNr">Zimmernummer *:</label>
                <input type="text" id="inputZimmerNr" size="5" maxlength="5" name="ZimmerNr" class="form-control"
                       required>
            </div>

            <div class="form-group">
                <label for="inputResNr">Reservierungsnummer:</label>
                <input type="text" id="inputResNr" size="10" maxlength="10" name="ReservierungNr" class="form-control">
            </div>

            <div class="form-group">
                <label for="inputGastNr">Gästenummer:</label>
                <input type="text" id="inputGastNr" size="10" maxlength="10" name="GastNr" class="form-control">
            </div>

            <div class="form-group">
                <label for="inputDatumVon">Startdatum *:</label>
                <input type="date" id="inputDatumVon" name="DatumVon" class="form-control"
                       required>
            </div>

            <div class="form-group">
                <label for="inputDatumBis">Enddatum *:</label>
                <input type="date" id="inputDatumBis" name="DatumBis" class="form-control"
                       required>
            </div>

            <button type="submit" class="btn btn-success">Search</button>
            <button type="submit" class="btn btn-primary">Delete</button>
            <button type="submit" class="btn btn-primary">Save changes</button>
        </form>
    </div>

</div>

<?php
include("templates/footer.php")
?>