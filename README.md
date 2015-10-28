# chrome-quick-dev
**a replacement tab for chrome to help make getting new projects up and running FAST**

## How does it work?

The extension is comprised of two parts: 1. The actual chrome extension, which is run from the browser, and overrides the default new tab page, and 2. The python flask application that runs in the background, accepting commands from the tab as an API.

This approach allows arbitrary operating system commands to be run from the browser, where normally this would be strictly off limits, and is still safe, within the context of the local user.

Things like creating, removing and opening folders and files is now possible, via chrome. This makes programmatic control of the OS user space possible directly from the browser - cool!

## Getting started

### Setup chrome extension
1. Go to `chrome:extensions` in your browser.
2. Pick "load unpacked extension"
3. Choose the quick-dev folder.

### Running flask application
`cd path/to/quick-dev/app/ && python flask-app.py`

### Running localhost server
`cd path/to/GENERATE_FILES/ && python -m SimpleHTTPServer 8080`

## Configuration
Use the `newtab-config.json` to configure options for both the flask and javascript scripts. See the file for examples of what can be configured.

### Customizing generate file folder.

By default, the flask application chooses to store generated projects two directories above, which is outside the git project. This can be configured to be a different relative path, or an absolute one. Just change the constant `DEFAULT_PATH` in `flask-app.py`

## Current application templates
Customize all the templates you want by adding more project folders **in the flask app**, under `{quick-dev-path}/app/templates/projects/`. Currently, all links in `override.html` must match up with the folder name in the projects directory (e.g. '#jquery-plugin' link href must have a matching jquery-plugin folder).
