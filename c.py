import sys
import types
import json

from opcode import *
from opcode import __all__ as _opcodes_all

dict_pyc = {}


def dis_string(code, lasti=-1, varnames=None, names=None,
                       constants=None):
    # labels = findlabels(code)
 

    lines = []
    n = len(code)
    i = 0
    while i < n:
        c = code[i]
        op = ord(c)
        line = []
        line.append(int(i))
        line.append(opname[op])
        i = i+1
        if op >= HAVE_ARGUMENT:
            oparg = ord(code[i]) + ord(code[i+1])*256
            i = i+2
            line.append(int(oparg))
        lines.append(line)

    dict_pyc['co_code'] = lines

    instr_offset_map = {}

    for i,x in enumerate(lines):
    	instr_offset_map[int(x[0])] = i

    dict_pyc['instr_offset_map'] = instr_offset_map

s = open('m.py').read()

co = compile(s,'m.py','exec')

dis_string(co.co_code)

dict_pyc['co_names'] = list(co.co_names)

dict_pyc['co_consts'] = list(co.co_consts)

json_pyc = json.dumps(dict_pyc)

print json_pyc