const user = "Papypom";
const password = "password";
const message ="message";

console.log("User : " + user + "\nPassword : " + password);

console.log("Trying hash functions");




/*
Fetch the contents of the "message" textbox, and encode it
in a form we can use for the encrypt operation.
*/

/*
Get some key material to use as input to the deriveKey method.
The key material is a password supplied by the user.
*/


/*
Given some key material and some random salt
derive an AES-GCM key using PBKDF2.
*/

/*
Derive a key from a password supplied by the user, and use the key
to encrypt the message.
Update the "ciphertextValue" box with a representation of part of
the ciphertext.
*/


/*
Derive a key from a password supplied by the user, and use the key
to decrypt the ciphertext.
If the ciphertext was decrypted successfully,
update the "decryptedValue" box with the decrypted value.
If there was an error decrypting,
update the "decryptedValue" box with an error message.
*/

let salt;
let ciphertext;
let iv;

async function doencryptionstuff() {
    let enc = new TextEncoder();
    let keyMaterial = await window.crypto.subtle.importKey(
        "raw", 
        enc.encode(password), 
        {name: "PBKDF2"}, 
        false, 
        ["deriveBits", "deriveKey"]
    );
    salt = window.crypto.getRandomValues(new Uint8Array(16));
    let key = await window.crypto.subtle.deriveKey(
        {
            "name": "PBKDF2",
            salt: salt, 
            "iterations": 600000,
            "hash": "SHA-256"
        },
        keyMaterial,
        { "name": "AES-GCM", "length": 256},
        true,
        [ "encrypt", "decrypt" ]
        );
    iv = window.crypto.getRandomValues(new Uint8Array(12));
    let encoded = enc.encode(message);

    ciphertext = await window.crypto.subtle.encrypt(
    {
        name: "AES-GCM",
        iv: iv
    },
    key,
    encoded
    );
    

    let buffer = new Uint8Array(ciphertext, 0, 5);
    console.log( `${buffer}...[${ciphertext.byteLength} bytes total]`);

    try {
    let decrypted = await window.crypto.subtle.decrypt(
        {
        name: "AES-GCM",
        iv: iv
        },
        key,
        ciphertext
    );

    let dec = new TextDecoder();
    console.log(dec.decode(decrypted));
    } catch (e) {
    console.log("*** Decryption error ***");
    }
}

doencryptionstuff();