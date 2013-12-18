# -*-python-*-

import cgi
import os
import shutil
import tempfile
import subprocess
import json

from cherrypy.lib.static import serve_file

# ============================================================
# Whiley Compiler Config
# ============================================================

WYJC_JAR="lib/wyjc-all-v0.3.22b.jar"
WYRT_JAR="lib/wyrt-v0.3.22.jar"

# ============================================================
# Java Config
# ============================================================

JAVA_CMD="/usr/pkg/java/sun-6/bin/java"
#JAVA_CMD="java"

# ============================================================
# Mako Config
# ============================================================

from mako.template import Template
from mako.lookup import TemplateLookup
lookup = TemplateLookup(directories=['html'])

# ============================================================
# Application Config
# ============================================================
WORKING_DIR="data"

# ============================================================
# Application Entry
# ============================================================

class Main(object):
    def __init__(self,root_url,username):
        self.root_url = root_url
        self.username = username
    
    # gives access to images/
    def images(self, filename):
        abspath = os.path.abspath("images/" + filename)
        return serve_file(abspath, "image/png")
    images.exposed = True
    
    def js(self, filename):
        abspath = os.path.abspath("js/" + filename)
        return serve_file(abspath, "application/javascript")
    js.exposed = True

    def css(self, filename):
        abspath = os.path.abspath("css/" + filename)
        return serve_file(abspath, "text/css")
    css.exposed = True
    
    def compile(self,code,verify):
        # First, create working directory
        dir = createWorkingDirectory()
        dir = WORKING_DIR + "/" + dir
        # Second, compile the code
        result = compile(code,verify,dir)
        # Third, delete working directory
        shutil.rmtree(dir)
        # Fouth, return result as JSON
        return json.dumps(result)
    compile.exposed = True

    def save(self,code):
        # First, create working directory
        dir = createWorkingDirectory()
        # Second, save the file
        save(WORKING_DIR + "/" + dir + "/tmp.whiley", code)        
        # Fouth, return result as JSON
        return json.dumps({
            "id": dir
            })
    save.exposed = True        

    def run(self,code):
        # First, create working directory
        dir = createWorkingDirectory()
        dir = WORKING_DIR + "/" + dir
        # Second, compile the code and then run it
        result = compile(code,"false",dir)
        # Third, run the code
        output = run(dir)
        # Third, delete working directory
        #shutil.rmtree(dir)
        # Fouth, return result as JSON
        return json.dumps({
            "errors": result,
            "output": output
            })
    run.exposed = True        

    # application root
    def index(self,id=None):
        if id != None:
            # Load the file
            code = load(WORKING_DIR + "/" + id + "/tmp.whiley")
            # Escape the code
            code = cgi.escape(code)           
        else:
            code = ""
        template = lookup.get_template("index.html")
        return template.render(ROOT_URL=self.root_url,CODE=code)
    index.exposed = True
    # exposed

# ============================================================
# Compiler Interface
# ============================================================
    
# Load a given JSON file from the filesystem
def load(filename):
    f = open(filename,"r")
    data = f.read()
    f.close()
    return data

# Save a given file to the filesystem
def save(filename,data):
    f = open(filename,"w")
    f.write(data)
    f.close()
    return

# Compile a snippet of Whiley code.  This is done by saving the file
# to disk in a temporary location, compiling it using the Whiley2Java
# Compiler and then returning the compilation output.
def compile(code,verify,dir):
    filename = dir + "/tmp.whiley"
    # set required arguments
    args = [
        JAVA_CMD,
        "-jar",
        WYJC_JAR,
        "-bootpath", WYRT_JAR, # set bootpath
        "-whileydir", dir,     # set location of Whiley source file(s)
        "-classdir", dir,      # set location to place class file(s)
        "-brief"              # enable brief compiler output (easier to parse)
    ]
    # Configure optional arguments
    if verify == "true":
        args.append("-verify")
    # save the file
    save(filename, code)
    args.append(filename)    
    # run the compiler
    proc = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell=False)
    (out, err) = proc.communicate()
    if err == None:
        return splitErrors(out)
    else:
        return splitErrors(err)

def run(dir):
    # run the JVM
    proc = subprocess.Popen([
        JAVA_CMD,
        "-cp",WYJC_JAR + ":" + dir,
        "tmp"
        ], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell=False)
    (out, err) = proc.communicate()
    return out

# Split errors output from WyC into a list of JSON records, each of
# which includes the filename, the line number, the column start and
# end, as well a the text of the error itself.
def splitErrors(errors):
    r = []
    for err in errors.split("\n"):
        if err != "":
            r.append(splitError(err))
    return r

def splitError(error):
    error = error.split(":")
    return {
        "filename": error[0],        
        "line": error[1],
        "start": error[2],
        "end": error[3],
        "text": error[4]        
    }

# Get the working directory for this request.
def createWorkingDirectory():
    dir = tempfile.mkdtemp(prefix="",dir=WORKING_DIR)
    tail,head = os.path.split(dir)
    return head
