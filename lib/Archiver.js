/*!
 * Node Archiver
 *
 * Copyright (C) 2012, Kai Sellgren
 * Licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license.php
 */

var fs = require('fs');
var Util = require('./Util');

module.exports = {
	/**
	 * Creates a new archive.
	 *
	 * @param {String} file Full path to the file.
	 * @param {Object} options
	 * @param {Function} callback
	 */
	createArchive: function(file, options, callback) {

	},

	/**
	 * Opens an archive.
	 *
	 * @param {String} file Full path to the file.
	 * @param {Function} callback
	 */
	openArchive: function(file, callback) {
		var data = fs.readFileSync(file);

		switch (Util.detectArchiveFormat(data)) {
			case 'zip':
				require('./archives/zip/ZipArchive').openArchive(data, callback);
				break;
		}
	}
};