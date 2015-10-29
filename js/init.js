var config = null;
var API_ROOT = null;

function loadRecent() {
    $('#recent').empty();
    function loadOne(_, obj) {
        $('#recent').append('<li><a href="#">' + obj + '</a></li>');
    }
    chrome.storage.local.get('all-projects', function(data) {
        $.each(data['all-projects'].reverse(), loadOne);
    });
    $('#recent').on('click', 'li > a', function(e){
        $('#loading').addClass('in');
        e.preventDefault();
        $.ajax({
            url: API_ROOT + 'open/' + $(this).text().trim() + '/',
            complete: function(d) {
                return $('#loading').removeClass('in');
            }
        });
    });
}

function heartbeatCheck() {
    $.ajax({
        url: API_ROOT,
        success: function(){
            $('#success').addClass('in');
            $('#error').removeClass('in');
        },
        error: function(){
            $('#error').addClass('in');
            $('#success').removeClass('in');
        }
    });
}

function startProjectEdit(project) {
    window.open(config.url + project);
    if(confirm('New github repo?') && config.prompt_git) window.open('https://github.com/new');
    // Setup history
    chrome.storage.local.get('all-projects', function(data) {
        var d = data['all-projects'];
        // Array, but I'm too lazy to do proper
        // type checking in js (for now)
        if(typeof d === 'object') {
            d.push(project);
        } else {
            d = [d];
        }
        chrome.storage.local.set({'all-projects': d});
    });
}

function makeProject(name) {
    var project = prompt('Project name: ');
    if(!project) {
        alert('Must specify a project name.');
        return $('#loading').removeClass('in');
    }
    $.ajax({
        type: 'post',
        data: {
            name: project,
            serve: true
        },
        url: API_ROOT + 'make/' + name + '/',
        success: function(){
            $('#loading').removeClass('in');
            startProjectEdit(project);
        },
        complete: function() {
            setTimeout(function(){
                $('#loading').removeClass('in');
            }, 1000);
        }
    });
}

function loadProjects(projects) {
    $.each(projects, function(link, title){
        $('#templates').append('<li><a href="#' + link + '">' + title + ' </a></li>')
    });
}

function init() {
    $.getJSON('newtab-config.json', function(data){
        config = data.js;
        API_ROOT = config.api_url;
        loadProjects(config.projects);
        $('a').attr('target', '_blank');
        $('#templates').find('li > a').on('click', function(e){
            $('#loading').addClass('in');
            e.preventDefault();
            e.stopImmediatePropagation();
            var name = $(this).attr('href').replace('#', '');
            makeProject(name);
        });
        loadRecent();
        setInterval(heartbeatCheck, 5000);
        heartbeatCheck();
    });
}

$(document).ready(init);
