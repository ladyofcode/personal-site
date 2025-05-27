import { promises as fs } from 'fs';
import path from 'path';

function getImageDimensions(buffer) {
    console.log('First 20 bytes (hex):', Array.from(buffer.slice(0, 20)).map(b => b.toString(16).padStart(2, '0')).join(' '));
    console.log('First 20 bytes (decimal):', Array.from(buffer.slice(0, 20)).join(' '));
    
    const searchLimit = Math.min(4096, buffer.length);
    let jpegStart = -1;
    
    for (let i = 0; i < searchLimit - 1; i++) {
        if (buffer[i] === 0xFF && buffer[i + 1] === 0xD8) {
            jpegStart = i;
            console.log('JPEG signature found at position', i);
            break;
        }
    }

    if (jpegStart >= 0) {
        let i = jpegStart + 2;
        while (i < buffer.length - 1) {
            if (buffer[i] === 0xFF) {
                const marker = buffer[i + 1];
                if (marker === 0xC0 || marker === 0xC2) {
                    console.log(`Found SOF marker at position ${i}: ${marker === 0xC0 ? 'SOF0' : 'SOF2'}`);
                    const height = buffer.readUInt16BE(i + 5);
                    const width = buffer.readUInt16BE(i + 7);
                    return { width, height };
                }
                const length = buffer.readUInt16BE(i + 2);
                console.log(`Skipping marker 0xFF${marker.toString(16)} at ${i}, length ${length}`);
                i += 2 + length;
            } else {
                i++;
            }
        }
        console.log('JPEG signature found but no SOF marker');
    }
    
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
        console.log('PNG signature found');
        const width = buffer.readUInt32BE(16);
        const height = buffer.readUInt32BE(20);
        return { width, height };
    }
    
    console.log('No JPEG or PNG signature found');
    return null;
}

async function processMemories() {
    try {
        const jsonPath = path.join(process.cwd(), 'src', 'content', 'memories.json');
        const jsonContent = await fs.readFile(jsonPath, 'utf8');
        const data = JSON.parse(jsonContent);

        for (const memory of data.memories) {
            if (memory.featuredImage) {
                const imagePath = typeof memory.featuredImage === 'string' 
                    ? memory.featuredImage 
                    : memory.featuredImage.path;

                const fullPath = path.join(process.cwd(), 'src', 'content', 'img', imagePath);
                console.log('\nProcessing image:', fullPath);
                
                try {
                    const buffer = await fs.readFile(fullPath);
                    console.log('File size:', buffer.length, 'bytes');
                    const dimensions = getImageDimensions(buffer);
                    
                    if (dimensions) {
                        if (typeof memory.featuredImage === 'string') {
                            memory.featuredImage = {
                                path: memory.featuredImage,
                                ...dimensions
                            };
                        } else {
                            memory.featuredImage = {
                                ...memory.featuredImage,
                                ...dimensions
                            };
                        }
                        console.log(`Added dimensions for ${imagePath}: ${dimensions.width}x${dimensions.height}`);
                    } else {
                        console.error(`Could not get dimensions for ${imagePath}: Unsupported image format`);
                    }
                } catch (error) {
                    console.error(`Error reading image ${imagePath}:`, error);
                }
            }
        }

        await fs.writeFile(jsonPath, JSON.stringify(data, null, 2));
        console.log('Successfully updated memories.json with image dimensions');

    } catch (error) {
        console.error('Error processing memories:', error);
    }
}

processMemories(); 