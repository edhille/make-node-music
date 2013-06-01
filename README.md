make-node-music
===============

Just a playground to try out generating PCM data for Sox player in Node

Requirements
------------

In order to run any of this code, you will need to have [Sox](http://sox.sourceforge.net) installed.

Caveats
-------

Node isn't so great at timing and it seems that if you use streams to generate a pipeline for signal information to pipe into Sox, things don't really work that well.  However, this was illuminating to write both in terms of how to generate PCM data and how streams work in Node.  So, if you're interested in either of those two things, then by all means play with this code.
