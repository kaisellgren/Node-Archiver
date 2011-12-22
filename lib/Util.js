/*!
 * Node Archiver
 *
 * Copyright (C) 2012, Kai Sellgren
 * Licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license.php
 */

module.exports = {
	/**
	 * Returns a number that is represented in the bytes of the given buffer.
	 *
	 * @param {Buffer} buffer
	 * @return {Number}
	 */
	bufferToUInt8Value: function(buffer) {
		var value = 0;

		for (var i = 0, length = buffer.length; i < length; i++) {
			value += buffer.readUInt8(i) * Math.pow(256, i);
		}

		return value;
	},

	/**
	 * Checks whether all the given bytes appear in a sequence on the specified buffer and position.
	 *
	 * @param {Buffer} buffer
	 * @param {Number} position
	 * @param {String|Array} bytes
	 */
	doesBufferMatchBytesAtPosition: function(buffer, position, bytes) {
		var match = true;

		// Convert strings to byte arrays.
		if (typeof bytes === 'string') {
			var byteArray = [];
			bytes.split('').forEach(function(byteString) {
				byteArray.push(byteString.charCodeAt(0));
			});

			bytes = byteArray;
		}

		for (var i = 0, length = bytes.length; i < length; i++) {
			if (buffer.readUInt8(position + i) !== bytes[i]) {
				match = false;
				break;
			}
		}

		return match;
	},

	/**
	 * Detects the format of the archive.
	 *
	 * @param {Buffer} data
	 * @return string The format of the archive. This could be "zip", "tar", "rar", etc.
	 */
	detectArchiveFormat: function(data) {
		// Detect Zip files.
		var regularZip = data[2] === 0x03 && data[3] === 0x04;
		var emptyZip = data[2] === 0x05 && data[3] === 0x06;
		var spannedZip = data[2] === 0x07 && data[3] === 0x08;

		if (data[0] === 0x50 && data[1] === 0x4b && (regularZip || emptyZip || spannedZip)) {
			return 'zip';
		}

		return null;
	}
};