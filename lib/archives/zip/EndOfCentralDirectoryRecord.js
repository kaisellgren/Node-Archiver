/*!
 * Node Archiver
 *
 * Copyright (C) 2012, Kai Sellgren
 * Licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license.php
 */

var Zip = require('./ZipArchive');
var Util = require('../../Util.js');

/**
 * Creates a new instance of the End of Central Directory Record.
 *
 * @class EndOfCentralDirectoryRecord
 * @param {Buffer} data
 */
function EndOfCentralDirectoryRecord(data) {
	this.data = data;

	this.process();
}

// I.  End of central directory record:
//
//   end of central dir signature    4 bytes  (0x06054b50)
//   number of this disk             2 bytes
//   number of the disk with the
//   start of the central directory  2 bytes
//   total number of entries in the
//   central directory on this disk  2 bytes
//   total number of entries in
//   the central directory           2 bytes
//   size of the central directory   4 bytes
//   offset of start of central
//   directory with respect to
//   the starting disk number        4 bytes
//   .ZIP file comment length        2 bytes
//   .ZIP file comment               (variable size)

EndOfCentralDirectoryRecord.prototype = {
	data: null,

	signature: Zip.END_OF_CENTRAL_DIRECTORY_RECORD_SIGNATURE,
	totalCentralDirectoryEntries: null,
	centralDirectorySize: null,
	centralDirectoryOffset: null,
	zipFileCommentLength: null,
	zipFileComment: null,

	/**
	 * Process the end of central directory record.
	 */
	process: function() {
		this.totalCentralDirectoryEntries = Util.bufferToUInt8Value(this.data.slice(10, 12));
		this.centralDirectorySize = Util.bufferToUInt8Value(this.data.slice(12, 16));
		this.centralDirectoryOffset = Util.bufferToUInt8Value(this.data.slice(16, 20));
		this.zipFileCommentLength = Util.bufferToUInt8Value(this.data.slice(20, 22));
		this.zipFileComment = Util.bufferToUInt8Value(this.data.slice(22, 22 + this.zipFileCommentLength));
	}
};

module.exports = EndOfCentralDirectoryRecord;