from Crypto.Cipher import AES
import base64
from base64 import b64decode, b64encode
from decouple import config


def encryptionDecryption(flag, input_cmd):
    try:
        print("--->>> ", flag, input_cmd)
        iv = config('INITVECTOR').encode("utf8")
        key = config('SECURITYKEY').encode("utf8")
        if flag == 0:
            # Encryption
            print("Encryption Method")
            strValue = str.encode(input_cmd)
            data = strValue
            cipher = AES.new(key, AES.MODE_CBC, iv)
            data = b64encode(data)
            pad = data + b"\0" * (AES.block_size - len(data) % AES.block_size)
            ciphertext = cipher.encrypt(pad)
            # print(b64encode(ciphertext).decode("utf-8"))
            return b64encode(ciphertext).decode("utf-8")
        else:
            # Decryption
            print("Decryption Method")
            enc = base64.b64decode(input_cmd)
            print("0")
            cipher = AES.new(key, AES.MODE_CBC, iv)
            print("1")
            data = cipher.decrypt(enc)
            print("2")
            print(b64decode(data))
            print("3");
            return b64decode(data)
    except Exception as e:
        print(e)
        return 0
