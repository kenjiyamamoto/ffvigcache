#!/usr/bin/env python
# -*- coding: utf-8 -*

import commands

def criar_xpi_file():
    criar_dir_temporario()
    criar_jar()
    criar_xpi_de_fato()
    
def criar_dir_temporario():
    execute_cmd('mkdir temp')

def criar_jar():
    execute_cmd('cp -r src/* temp/')
    execute_cmd('cd temp/chrome')
    execute_cmd('cd temp/chrome && jar cf ffvigcache.jar content/*')
    execute_cmd('rm -fr temp/chrome/content')

def criar_xpi_de_fato():
    execute_cmd('cd temp && zip -r ../ffvigcache.xpi *')
    execute_cmd('rm -rf temp')

def execute_cmd(cmd, verbose=True):
    if verbose: print cmd
    return commands.getoutput(cmd)    



if __name__ == '__main__':
    criar_xpi_file()
    print 'xpi criado'
    
