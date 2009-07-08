#!/usr/bin/env python
# -*- coding: utf-8 -*


def criar_xpi_file():
    criar_dir_temporario()
    criar_jar()
    criar_xpi_de_fato()
    remover_dir_temporario()
    
    
def criar_dir_temporario():
    execute_cmd('mkdir temp')

def criar_jar():
    execute_cmd('cp -r src/* temp/')
    execute_cmd('cd temp')
    execute_cmd('cd chrome')
    execute_cmd('jar cf ffvigcache.jar content/*')
    execute_cmd('rm -fr content')
    execute_cmd('cd ../..')

def criar_xpi_de_fato():
    execute_cmd('tar czvf ffvigcache.zip temp/*')
    execute_cmd('rm -rf temp')

def execute_cmd(cmd, verbose=True):
    if verbose: print cmd
    return commands.getoutput(cmd)    



if __name__ == '__main__':
    criar_xpi_file()
    print 'xpi criado'
    
