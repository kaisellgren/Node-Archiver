What's Archiver?
==
Archiver is a NodeJS module that enables easy archive reading and writing. Currently it is under progress and will soon support the Zip format.

The aim is to provide support for Zip, 7-Zip, TAR, RAR, ISO and Torrent formats.

__!!! ARCHIVER IS UNDER PROGRESS AND NOT YET READY FOR PRODUCTION USE !!!__

## How to install
It's not yet released, but when it is:

```
npm install Archiver
```

For now, clone the repo.

## Examples

#### Creating a new archive

```javascript
var Archiver = require('Archiver');

var zip = Archiver.createArchive('file.zip'); // Without further configs, the supplied file extension determines the format.

zip.addFile('foo.txt'); // Add the file you have in your filesystem.
zip.addFolder('baz/qux'); // No need for creating sub folders separately.
zip.addFileFromString('baz/qux/bar.txt', 'contents of bar.txt file');

zip.save(function(err) {
    if (err) {
        throw err;
    }
    
    // Success!
});
```

#### More complex example of creating an archive

```javascript
var Archiver = require('Archiver');

var zip = Archiver.createArchive('file', {
    format: 'zip', // If the filename does not contain the proper extension, you must tell archiver what the format is.
    compressionMethod: 'Deflate', // Other options include: Store, Shrunk, Implode, BZIP2, LZMA.
    compressionThreshold: 1024, // Files smaller than this are not compressed.
    password: '1234', // Planned feature (encryption).
    encryptFilenamesAlso: true, // Encrypts also filenames in addition to contents. Planned feature (encryption).
    comment: 'foo bar' // Add a comment to the archive.
});

zip.addFile('foo.txt', {
    compressionMethod: 'LZMA', // This will be compressed with LZMA, superceding the default compression method.
    comment: 'foo bar' // Add a comment to this specific file.
});

zip.save(); // Provide a callback if you want.
```

#### Extract an archive

```javascript
var Archiver = require('Archiver');

Archiver.openArchive('file.zip', function(err, zip) {
    zip.extractTo('/path/to/target/folder/', function(err) {
        if (err) {
            throw err;
        }
        
        // Success!
    });
});

// Shortcut:
Archiver.extractArchiveTo('file.zip', '/path/to/target/folder', function(err) {
    if (err) {
        throw err;
    }
    
    // Success!
});
```

#### Inspect an archive without extracting (memory efficient)

```javascript
var Archiver = require('Archiver');

Archiver.openArchive('file.zip', function(err, zip) {
    var files = zip.getFiles();
    
    console.log('Zip uncompressed size: ' + zip.getUncompressedSize());
    
    files.forEach(function(file) {
        console.log(file.getFilename(), file.getUncompressedSize());
    });
});
```
```
Zip uncompressed size: 2123
foo.txt 1020
bar.txt 1103
```

## Security

#### Always check "uncompressed" size before extracting user supplied archives
Do not trust user input. Do not trust their archives. A user may have sent you a [Zip bomb](http://en.wikipedia.org/wiki/Zip_bomb).

```javascript
var Archiver = require('Archiver');

Archiver.openArchive('file.zip', function(err, zip) {
    // Limit to 100 MB.
    if (zip.getUncompressedSize() < 1024 * 1024 * 100) {
        zip.extractTo('/path/to/target/folder/', function(err) {
            if (err) {
                throw err;
            }
        
            // Success!
        });
    }
});
```

If you can trust the archive (for example, you made the archive), then you can skip this check.

#### Path traversal attacks within archives
Several archiving libraries suffer from path traversal attacks. Even built-in archivers like the one in PHP had issues with it in the past: http://www.securityfocus.com/bid/32625

It is very important that path traversal attacks are taken care of. Luckily for you, Archiver is protected against such attacks and you do not even need to know about this.