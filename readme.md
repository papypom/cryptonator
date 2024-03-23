# Cryptonator
This is me trying out session management and cryptography function in browser (SubtleCrypto). The goal is to implement some kind of E2EE system. No idea where it will go.

## HTTPS needed
Most of the Crypto stuff needs an https connexion, hence the whole certificate folder. The certificate validates localhost, and the nginx config can be found in the nginx file.

If needed, here's the step I took to create the certificate chain, should work with Debian/Ubuntu on which OpenSSL is installed.

Create stuff, set password (here it's `password`), answer questions, the only important one is the fully qualified domain name (FQDN), for which I'm using localhost :

    openssl genrsa -des3 -out rootCA.key 2048
    openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 730 -out rootCert.pem
    openssl genrsa -out cert.key 2048
    openssl req -new -key cert.key -out cert.csr

Create configuration file `openssl.cnf`, in which `[ alt_names ]` should be your FQDN : 

    basicConstraints       = CA:FALSE
    authorityKeyIdentifier = keyid:always, issuer:always
    keyUsage               = nonRepudiation, digitalSignature, keyEncipherment, dataEncipherment
    subjectAltName         = @alt_names
    [ alt_names ]
    DNS.1 = localhost

Then sign and verify stuff using :

    openssl x509 -req -in cert.csr -CA rootCert.pem -CAkey rootCA.key -CAcreateserial -out cert.crt -days 730 -sha256 -extfile openssl.cnf
    openssl verify -CAfile rootCert.pem -verify_hostname localhost cert.crt

There, you have a full certificate chain (self signed, but usable nonetheless).