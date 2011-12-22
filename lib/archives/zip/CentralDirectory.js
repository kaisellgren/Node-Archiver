/*!
 * Node Archiver
 *
 * Copyright (C) 2012, Kai Sellgren
 * Licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license.php
 */

var Zip = require('./ZipArchive');
var Util = require('../../Util.js');
var CentralDirectoryFileHeader = require('./CentralDirectoryFileHeader.js');

const FILE_HEADER_STATIC_SIZE = 46; // The static size of the file header.

/**
 * Creates a new instance of the Central Directory.
 *
 * @param {Buffer} data
 */
function CentralDirectory(data) {
	this.data = data;

	this.process();
}

// [file header 1]
//   .
//   .
//   .
//   [file header n]
//   [digital signature]
//
//   File header:
//
// 	central file header signature   4 bytes  (0x02014b50)
// 	version made by                 2 bytes
// 	version needed to extract       2 bytes
// 	general purpose bit flag        2 bytes
// 	compression method              2 bytes
// 	last mod file time              2 bytes
// 	last mod file date              2 bytes
// 	crc-32                          4 bytes
// 	compressed size                 4 bytes
// 	uncompressed size               4 bytes
// 	file name length                2 bytes
// 	extra field length              2 bytes
// 	file comment length             2 bytes
// 	disk number start               2 bytes
// 	internal file attributes        2 bytes
// 	external file attributes        4 bytes
// 	relative offset of local header 4 bytes
//
// 	file name (variable size)
// 	extra field (variable size)
// 	file comment (variable size)

CentralDirectory.prototype = {
	data: null,

	signature: Zip.CENTRAL_DIRECTORY_FILE_HEADER_SIGNATURE,
	fileHeaders: [],
	digitalSignature: null,

	/**
	 * Process the data.
	 */
	process: function() {
		var position = 0;

		// Create file headers. Loop until we have gone through the entire buffer.
		while (true) {
			// Calculate sizes for dynamic parts.
			var filenameSize = Util.bufferToUInt8Value(this.data.slice(28, 30));
			var extraFieldSize = Util.bufferToUInt8Value(this.data.slice(30, 32));
			var fileCommentSize = Util.bufferToUInt8Value(this.data.slice(32, 34));

			var dynamicSize = filenameSize + fileCommentSize + extraFieldSize;
			var totalFileHeaderSize = dynamicSize + FILE_HEADER_STATIC_SIZE;

			// Push a new file header.
			var buffer = this.data.slice(position, position + totalFileHeaderSize);
			this.fileHeaders.push(new CentralDirectoryFileHeader(buffer));

			// Move the position pointer forward.
			position += totalFileHeaderSize;

			// Break out of the loop if the next 4 bytes do not match the right file header signature.
			if (!Util.doesBufferMatchBytesAtPosition(this.data, position, Zip.CENTRAL_DIRECTORY_FILE_HEADER_SIGNATURE)) {
				break;
			}
		}

		// TODO: Process the possible digital signature.
	}
};

module.exports = CentralDirectory;