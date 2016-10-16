## TimelineMe

The aim of this plugin is to easily build a timeline display for your data.

## Installation

**npm:**
```
npm install jquery-timelineme
```

**classic:**
- add jQuery to your project
- add timelineMe css & js

## TODO

- dynamically add items with json records
- add to bower

## Usage

**HTML**
```html
    <head>
        <link rel="stylesheet" href="css/jquery.timelineMe.css">
    </head>
    <body>
        <div id="timeline-container"></div>
        <script src="path/to/jquery/jquery.js"></script>
        <script src="path/to/plugin/jquery.timelineMe.js"></script>
    </body>
```

**JAVASCRIPT**
```javascript
    $(document).ready(function() {
        $('#timeline-container').timelineMe({
		    items: [
                // Put your timeline items here
                {
                    type: 'milestone',
                    label: 'my label'
                },
                {
                    type: 'smallItem',
                    label: 'html label',
                    shortContent: 'html short desc'
                },
                {
                    type: 'bigItem',
                    label: 'html label',
                    shortContent: 'html short desc',
                    fullContent: 'html big desc',
                    showMore: 'show more',
                    showLess: 'show less'
                }
            ]
		});
    });
```

## Demo

See [demo project page](http://mickaelr.github.io/jquery-timelineMe/)

## License

The plugin is under MIT License
