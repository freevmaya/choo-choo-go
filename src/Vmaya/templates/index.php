<?
    $page_title = Lang('app_name');
    $v = SCRIPTS_VERSION;
?>
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title><?=$page_title?></title>
  
  <!-- Bootstrap CSS -->
  <link href="<?=BASEURL?>/styles/bootstrap.min.css" rel="stylesheet">
  <!-- Bootstrap Icons -->
  <link rel="stylesheet" href="./styles/bootstrap-icons.css">
  <!-- Custom CSS -->
  <link rel="stylesheet" href="<?=BASEURL?>/styles/main.css?v=<?=$v?>">
  <link rel="stylesheet" href="<?=BASEURL?>/styles/dialog.css?v=<?=$v?>">

  <!-- JQUERY -->
  <script src="<?=SCRIPTURL?>jquery-4.0.0.min.js"></script>
  <script src="https://code.jquery.com/ui/1.13.2/jquery-ui.min.js"></script>
  <link rel="stylesheet" href="https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js"></script>

  <script>
    var DEV = <?=DEV ? 'true' : 'false'?>;
  </script>
  <?include('tracker.php')?>
</head>
<body>
    <?=$content?>
</body>
</html>