 #!/bin/bash
 SRC="$1"; 
 DST="$2";
 find . -type f -name "*.*" -exec sed -i 's,'"$SRC"','"$DST"',' {} \;