var archiver = require('../lib/Archiver');

archiver.openArchive('test.zip', function(err, archive) {
	console.log(err, archive.centralDirectory.fileHeaders);
});