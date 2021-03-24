.model flat, stdcall
ExitProcess PROTO, dwExitCode:DWORD
.code
main PROC
mov eax,5
invoke ExitProcess, eax ; if the program runs successfully the final message in the Debug output will be: "...exited with code 5 (0x5)"
main ENDP
END