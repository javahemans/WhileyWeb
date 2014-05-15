#!/usr/bin/env python

import os
import cgi
import cgitb
import sys

import config

os.chdir(config.HOME_DIR)
if config.DEBUG:
    cgitb.enable()

sys.path.insert(0, "lib")
sys.path.insert(0, "src")

import cherrypy
import main

import wsgiref.handlers

cherrypy_config = {
    "global": {
        "log.screen": None
    },
    "/": {
        "request.show_tracebacks": False,
        "request.show_mismatched_params": False,
        "log.error_file": config.ERROR_LOG
    }
}
def application(environ, start_response):
    app = cherrypy.tree.mount(main.Main(), config.ROOT_URL, config=cherrypy_config)
    return app(environ,start_response)

if __name__ == '__main__':
    wsgiref.handlers.CGIHandler().run(application)
