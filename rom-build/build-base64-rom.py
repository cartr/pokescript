import base64

outf = open("rom.js","w")
outf.write("window.pokerom = atob('")
outf.write(base64.b64encode(open("../pokered/pokered.gbc").read()))
outf.write("');")
outf.close()