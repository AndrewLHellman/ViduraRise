from paramiko import SSHClient, AutoAddPolicy
import os, base64
from sem_ppi_cmd import *


def ssh_connection(cmd):
    try:
        client = SSHClient()
        client.set_missing_host_key_policy(AutoAddPolicy())
        client.load_system_host_keys()
        client.connect('ec2-54-197-203-247.compute-1.amazonaws.com', username='ec2-user', port=22,
                       key_filename="./semServer.pem")
        print("SSH connection made succesfull!: ec2-54-197-203-247.compute-1.amazonaws.com")
        return{"status": 1, "msg": "command ran successfully"}
    
    except Exception as e:
        print('SSH connection failed!', str(e))
        return{"status": 0, "msg": "Connection not established with server"}

   