from flask import Flask
from flask import render_template
from flask import request
import os
import datetime
import json
import hashlib


app = Flask(__name__)
app.debug = True
config = None

# Use config file
with open('../newtab-config.json', 'r') as json_config:
    config = dict(json.loads(json_config.read()))['flask']


@app.route('/')
def index():
    cwd = os.getcwd()
    files = os.listdir(cwd)
    return render_template('dashboard.html', files=files)


@app.route('/open/<folder>/', methods=['GET'])
def open_folder(folder):
    os.system('{} {}{}/'.format(
        config['editor'], config['default_path'], folder))
    return json.dumps({
        'success': True,
        'status': 200,
        'message': 'Opened folder {}'.format(folder)
    })


@app.route('/make/<make_type>/', methods=['POST'])
def make_folder(make_type):
    accepted = ['jquery-plugin', 'd3js-plugin', 'babel']
    if make_type not in accepted:
        return json.dumps({
            'success': False,
            'status': 500,
            'message': 'Invalid project type!'
        })
    # Prevent collisions in generated files
    now = str(datetime.datetime.now()).strip()
    hash = hashlib.md5(now).hexdigest()
    if 'name' in request.form and request.form['name'] != '':
        name = request.form['name']
    else:
        name = '{}{}'.format(make_type, hash)
    path = '{}{}'.format(config['default_path'], name)

    # Make type is specifiy in request: e.g. 'jquery-plugin', 'd3js-plugin...'
    os.system('mkdir {}'.format(path))
    # Copy project dir
    os.system('cp -r templates/projects/{}/* {}'.format(make_type, path))

    if 'serve' in request.form:
        # Open for editing
        os.system('{} {}'.format(config['editor'], path))
    return json.dumps({
        'success': True,
        'status': 200,
        'message': 'Created new folder...'
    })

if __name__ == '__main__':
    app.run(debug=True)
