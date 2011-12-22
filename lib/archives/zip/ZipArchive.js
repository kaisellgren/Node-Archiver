/*!
 * Node Archiver
 *
 * Copyright (C) 2012, Kai Sellgren
 * Licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license.php
 */

var Util = require('../../Util.js');

const LOCAL_FILE_HEADER_SIGNATURE = "\x50\x4b\x03\x04";
const DATA_DESCRIPTOR_SIGNATURE = "\x50\x4b\x07\x08";
const CENTRAL_DIRECTORY_FILE_HEADER_SIGNATURE = "\x50\x4b\x01\x02";
const END_OF_CENTRAL_DIRECTORY_RECORD_SIGNATURE = "\x50\x4b\x05\x06";
const CENTRAL_DIRECTORY_DIGITAL_SIGNATURE_SIGNATURE = "\x50\x4b\x05\x05";

/**
 * Represents a Zip file.
 *
 * @param {Buffer} data
 */
function ZipArchive(data) {
	this.data = data;

	this.process();
}

ZipArchive.prototype = {
	/**
	 * Stores the data of this Zip archive.
	 *
	 * @type {Buffer}
	 */
	data: null,

	endOfCentralDirectoryRecord: null,
	centralDirectory: null,

	process: function() {
		var CentralDirectory = require('./CentralDirectory.js');
		var EndOfCentralDirectoryRecord = require('./EndOfCentralDirectoryRecord.js');

		// Create End of Central Directory Record object.
		var position = getEndOfCentralDirectoryRecordPosition(this.data);
		if (!position) {
			throw new Error('Could not locate the End of Central Directory Record. The archive seems to be a corrupted Zip archive.');
		}

		this.endOfCentralDirectoryRecord = new EndOfCentralDirectoryRecord(this.data.slice(position));

		// Create Central Directory object.
		var centralDirectoryOffset = this.endOfCentralDirectoryRecord.centralDirectoryOffset;
		var centralDirectoryOffsetEnd = this.endOfCentralDirectoryRecord.centralDirectorySize + centralDirectoryOffset;
		this.centralDirectory = new CentralDirectory(this.data.slice(centralDirectoryOffset, centralDirectoryOffsetEnd));

		// Create Local Files.

	},

	getFiles: function() {

	}
};

module.exports = {
	CENTRAL_DIRECTORY_FILE_HEADER_SIGNATURE: CENTRAL_DIRECTORY_FILE_HEADER_SIGNATURE,
	CENTRAL_DIRECTORY_DIGITAL_SIGNATURE_SIGNATURE: CENTRAL_DIRECTORY_DIGITAL_SIGNATURE_SIGNATURE,
	END_OF_CENTRAL_DIRECTORY_RECORD_SIGNATURE: END_OF_CENTRAL_DIRECTORY_RECORD_SIGNATURE,

	/**
	 * Opens a Zip archive of the given data.
	 *
	 * Calls the callback with the second argument being the archive object for this data.
	 *
	 * @param {Buffer} data
	 * @param {Function} callback
	 */
	openArchive: function(data, callback) {
		var error = false;

		var zipFile = new ZipArchive(data);

		callback(error, zipFile);
	}
};

/**
 * Finds the position of the End of Central Directory.
 *
 * @param {Buffer} data
 * @return {Number|Boolean} position
 */
function getEndOfCentralDirectoryRecordPosition(data) {
	// I want to shoot the smart ass who had the great idea of having an arbitrary sized comment field in this header.

	var maxScanLength = 65536;
	var length = data.length;
	var position = length - 4;

	for (; position > length - maxScanLength && position; position--) {
		if (Util.doesBufferMatchBytesAtPosition(data, position, END_OF_CENTRAL_DIRECTORY_RECORD_SIGNATURE)) {
			return position;
		}
	}

	return false;
}