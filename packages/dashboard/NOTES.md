## Wants

- [ ] Workflows - collection of jobs with full depndecy graph
    - [ ] Visualisation for workflows same as GH, execution states etc
    - [ ] Can I do it with a single jobs table ?? Maybe ?? Nice challenge!!

## Bugs

- [x] App needs restart on template changes, this needs fixing :|
- [x] etf shits itself

```bash
$ biome check --write . && etf --dirs src --write
Checked 18 files in 5ms. No fixes applied.

thread 'main' (275716) panicked at src/html.rs:315:49:
start byte index 299 is not a char boundary; it is inside '￼' (bytes 298..301 of string)
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

- [x] Model forwading not working :|
- [x] Shadow boundry global resets not handled :|
- [x] Aliased imports not working for scss files :|
- [x] Hydris console branding