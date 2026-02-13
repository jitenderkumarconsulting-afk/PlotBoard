find ../ -type d -depth 1 -exec echo 'Getting: ' {} \; -exec git --git-dir={}/.git --work-tree=$PWD/{} pull --all \;
