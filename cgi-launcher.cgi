#!/usr/bin/env python

# =============================================================
# USER CONFIG
# =============================================================

HOMEDIR = r"/u/staff/djp/projects/TeachingAlloc/"
ROOT_URL = r"/cgi-bin/cgiwrap/djp/teaching-alloc.cgi"

# ============================================================
# Path Config
# ============================================================

import os
import cgi
import cgitb; cgitb.enable()  # for troubleshooting
import sys

# change working directory
os.chdir(HOMEDIR)

sys.path.insert(0, "lib")
sys.path.insert(0, "src")

# ============================================================
# Imports
# ============================================================

import cherrypy
import main

# ============================================================
# Start CherryPY
# ============================================================

import wsgiref.handlers

config = {
    "/": {
        "request.show_tracebacks": False,
        "request.show_mismatched_params": False
    }
}
def application(environ, start_response):
    app = cherrypy.tree.mount(main.Main(ROOT_URL), ROOT_URL, config=config)
    return app(environ,start_response)

if __name__ == '__main__':
    wsgiref.handlers.CGIHandler().run(application)
