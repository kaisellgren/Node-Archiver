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
 * Creates a new instance of a Central Directory File Header.
 *
 * @param {Buffer} data
 */
function CentralDirectoryFileHeader(data) {
	this.data = data;

	this.process();
}

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

CentralDirectoryFileHeader.prototype = {
	data: null,

	signature: Zip.CENTRAL_DIRECTORY_FILE_HEADER_SIGNATURE,
	versionMadeBy: null,
	versionNeededToExtract: null,
	generalPurposeBitFlag: null,
	compressionMethod: null,
	lastModifiedFileTime: null,
	lastModifiedFileDate: null,
	crc32: null,
	compressedSize: null,
	uncompressedSize: null,
	filenameLength: null,
	extraFieldLength: null,
	fileCommentLength: null,
	diskNumberStart: null, // TODO: Implement.
	internalFileAttributes: null,
	externalFileAttributes: null,
	localHeaderOffset: null,
	filename: null,
	extraField: null,
	fileComment: null,

	/**
	 * Process the end of central directory record.
	 */
	process: function() {
		this.versionMadeBy = this.data.slice(4, 6);
		this.versionNeededToExtract = this.data.slice(6, 8);
		this.generalPurposeBitFlag = this.data.slice(8, 10);
		this.compressionMethod = this.data.slice(10, 12);
		this.lastModifiedFileTime = this.data.slice(12, 14);
		this.lastModifiedFileDate = this.data.slice(14, 16);
		this.crc32 = this.data.slice(16, 20);
		this.compressedSize = Util.bufferToUInt8Value(this.data.slice(20, 24));
		this.uncompressedSize = Util.bufferToUInt8Value(this.data.slice(24, 28));
		this.filenameLength = Util.bufferToUInt8Value(this.data.slice(28, 30));
		this.extraFieldLength = Util.bufferToUInt8Value(this.data.slice(30, 32));
		this.fileCommentLength = Util.bufferToUInt8Value(this.data.slice(32, 34));
		this.diskNumberStart = Util.bufferToUInt8Value(this.data.slice(34, 36));
		this.internalFileAttributes = Util.bufferToUInt8Value(this.data.slice(36, 38));
		this.externalFileAttributes = Util.bufferToUInt8Value(this.data.slice(38, 42));
		this.localHeaderOffset = Util.bufferToUInt8Value(this.data.slice(42, 46));
		this.filename = this.data.slice(46, 46 + this.filenameLength).toString('utf8');
		this.extraField = this.data.slice(46 + this.filenameLength, 46 + this.filenameLength + this.extraFieldLength);
		this.fileComment = this.data.slice(46 + this.filenameLength + this.extraFieldLength, 46 + this.filenameLength + this.extraFieldLength + this.fileCommentLength);
	}
};

module.exports = CentralDirectoryFileHeader;