#!/usr/bin/env python

# ============================================================
# Path Config
# ============================================================

import sys

sys.path.insert(0, "lib")
sys.path.insert(0, "src")

# ============================================================
# Imports
# ============================================================

import cherrypy
import main

# ============================================================
# Run Local HTTP Server
# ============================================================

config = {
    "/": {
        "request.show_tracebacks": False,
        "request.show_mismatched_params": False
    }
}
cherrypy.quickstart(main.Main("http://localhost:8080"), config=config)

