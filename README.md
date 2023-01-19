### Lansocket

Simple bi-directional client/server messaging system with built-in support for [Barrier](https://github.com/debauchee/barrier). Scans for open TCP ports used by Barrier via [nmap](https://nmap.org) and automatically connects to host(s) matching user-defined configuration.

It is recommended to map to your Barrier server's IP to an `/etc/hosts` alias if you have servers on different networks your client switches between (e.g. home and work).
