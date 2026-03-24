<script src="scripts/error-tracker.js?v=<?=$v?>"></script>
<script type="text/javascript">
	ErrorTracker.init({
		version: <?=SCRIPTS_VERSION;?>,
		user_id: <?=isset($this->user_id) ? $this->user_id : 0;?>,
		excludeDomains: [
			'generate-phrases',
			'yandex',
	        'google',
	        'example.org',
	        'generate-audio',
	        'check-audio'
	    ]
	});
</script>