"use client"

import { useState } from "react"
import { Copy, Check, Terminal, FileText, Network, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      className="h-7 w-7 p-0"
      onClick={copyToClipboard}
      title={copied ? "Copied!" : "Copy code"}
    >
      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
    </Button>
  )
}

interface SystemCallProps {
  name: string
  signature: string
  description: string
  example?: string
  returnValue?: string
  errorCodes?: string[]
  includes?: string[]
  dataStructures?: { name: string; definition: string }[]
}

function SystemCall({ name, signature, description, example, returnValue, errorCodes, includes, dataStructures }: SystemCallProps) {
  return (
    <div className="space-y-3 border-l-2 border-green-500/30 pl-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-lg text-green-400">{name}</h4>
          <CopyButton text={signature} />
        </div>
        
        {includes && includes.length > 0 && (
          <div className="text-xs">
            <strong className="text-purple-400">Required Headers:</strong>
            <div className="flex flex-wrap gap-1 mt-1">
              {includes.map(header => (
                <code key={header} className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-1 rounded text-xs">
                  #include &lt;{header}&gt;
                </code>
              ))}
            </div>
          </div>
        )}
        
        <div className="bg-muted rounded-lg p-3">
          <code className="text-sm font-mono">{signature}</code>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        
        {dataStructures && dataStructures.length > 0 && (
          <div className="text-xs space-y-2">
            <strong className="text-cyan-400">Data Structures:</strong>
            {dataStructures.map(struct => (
              <div key={struct.name} className="bg-cyan-50 dark:bg-cyan-900/20 p-2 rounded">
                <div className="font-semibold text-cyan-700 dark:text-cyan-300">{struct.name}:</div>
                <pre className="text-xs mt-1 overflow-x-auto"><code>{struct.definition}</code></pre>
              </div>
            ))}
          </div>
        )}
        
        {returnValue && (
          <div className="text-xs">
            <strong className="text-green-400">Returns:</strong> <code className="bg-muted px-1 rounded">{returnValue}</code>
          </div>
        )}
        
        {example && (
          <div className="bg-muted/50 p-3 rounded text-xs">
            <strong className="text-blue-400">Example:</strong>
            <pre className="mt-1 overflow-x-auto"><code>{example}</code></pre>
          </div>
        )}
        
        {errorCodes && errorCodes.length > 0 && (
          <div className="text-xs">
            <strong className="text-yellow-400">Common Errors:</strong>
            <div className="flex flex-wrap gap-1 mt-1">
              {errorCodes.map(code => (
                <Badge key={code} variant="outline" className="text-xs">{code}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function LinuxSystemCallsCheatsheet() {
  return (
    <div className="space-y-6">
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertDescription>
          This cheatsheet covers essential Linux system calls. Include <code>&lt;unistd.h&gt;</code>, <code>&lt;sys/types.h&gt;</code>, 
          and other relevant headers when using these calls in C programs.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="file" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="file">File I/O</TabsTrigger>
          <TabsTrigger value="process">Process</TabsTrigger>
          <TabsTrigger value="memory">Memory</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="signal">Signals</TabsTrigger>
        </TabsList>

        <TabsContent value="file" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                File Operations
                <Badge variant="secondary">Essential</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <SystemCall
                name="open"
                signature="int open(const char *pathname, int flags, mode_t mode);"
                description="Open a file and return a file descriptor. Flags determine access mode and behavior."
                includes={["sys/types.h", "sys/stat.h", "fcntl.h"]}
                dataStructures={[
                  {
                    name: "Common flags",
                    definition: `O_RDONLY    - Read only
O_WRONLY    - Write only  
O_RDWR      - Read/write
O_CREAT     - Create if doesn't exist
O_EXCL      - Fail if exists (with O_CREAT)
O_TRUNC     - Truncate to 0 bytes
O_APPEND    - Append mode
O_NONBLOCK  - Non-blocking I/O`
                  }
                ]}
                example={`#include <fcntl.h>
#include <sys/stat.h>

// Open file for reading
int fd = open("/etc/passwd", O_RDONLY);

// Create new file with permissions
int fd = open("newfile.txt", O_CREAT | O_WRONLY, 0644);`}
                returnValue="File descriptor on success, -1 on error"
                errorCodes={["ENOENT", "EACCES", "EMFILE"]}
              />
              
              <SystemCall
                name="read"
                signature="ssize_t read(int fd, void *buf, size_t count);"
                description="Read data from a file descriptor into a buffer."
                includes={["unistd.h"]}
                example={`#include <unistd.h>

char buffer[1024];
ssize_t bytes = read(fd, buffer, sizeof(buffer));
if (bytes > 0) {
    // Process the data
    buffer[bytes] = '\0';  // Null-terminate if text
}`}
                returnValue="Number of bytes read, 0 on EOF, -1 on error"
                errorCodes={["EBADF", "EFAULT", "EINTR"]}
              />
              
              <SystemCall
                name="write"
                signature="ssize_t write(int fd, const void *buf, size_t count);"
                description="Write data from a buffer to a file descriptor."
                includes={["unistd.h", "string.h"]}
                example={`#include <unistd.h>
#include <string.h>

const char *msg = "Hello, World!\n";
ssize_t bytes = write(STDOUT_FILENO, msg, strlen(msg));`}
                returnValue="Number of bytes written, -1 on error"
                errorCodes={["EBADF", "EFAULT", "ENOSPC"]}
              />
              
              <SystemCall
                name="close"
                signature="int close(int fd);"
                description="Close a file descriptor, freeing it for reuse."
                includes={["unistd.h"]}
                example={`#include <unistd.h>
#include <stdio.h>

if (close(fd) == -1) {
    perror("close failed");
}`}
                returnValue="0 on success, -1 on error"
                errorCodes={["EBADF", "EINTR", "EIO"]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="process" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Process Management
                <Badge variant="secondary">Core</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <SystemCall
                name="fork"
                signature="pid_t fork(void);"
                description="Create a new process by duplicating the current process."
                includes={["sys/types.h", "unistd.h"]}
                example={`#include <sys/types.h>
#include <unistd.h>
#include <stdio.h>

pid_t pid = fork();
if (pid == 0) {
    // Child process
    printf("Child process PID: %d\n", getpid());
} else if (pid > 0) {
    // Parent process
    printf("Parent process, child PID: %d\n", pid);
    wait(&status);
} else {
    // Fork failed
    perror("fork");
}`}
                returnValue="0 in child, child PID in parent, -1 on error"
                errorCodes={["EAGAIN", "ENOMEM"]}
              />
              
              <SystemCall
                name="exec"
                signature="int execve(const char *pathname, char *const argv[], char *const envp[]);"
                description="Replace current process image with a new program."
                includes={["unistd.h"]}
                example={`#include <unistd.h>

char *args[] = {"/bin/ls", "-la", NULL};
char *env[] = {NULL};
execve("/bin/ls", args, env);
// This line won't execute if execve succeeds
perror("execve failed");`}
                returnValue="Does not return on success, -1 on error"
                errorCodes={["ENOENT", "EACCES", "ENOMEM"]}
              />
              
              <SystemCall
                name="wait"
                signature="pid_t wait(int *status);"
                description="Wait for any child process to terminate."
                includes={["sys/wait.h"]}
                dataStructures={[
                  {
                    name: "Status macros",
                    definition: `WIFEXITED(status)   - True if child exited normally
WEXITSTATUS(status) - Exit status of child
WIFSIGNALED(status) - True if child killed by signal  
WTERMSIG(status)    - Signal that killed child`
                  }
                ]}
                example={`#include <sys/wait.h>
#include <stdio.h>

int status;
pid_t child_pid = wait(&status);
if (WIFEXITED(status)) {
    printf("Child exited with status %d\n", WEXITSTATUS(status));
} else if (WIFSIGNALED(status)) {
    printf("Child killed by signal %d\n", WTERMSIG(status));
}`}
                returnValue="PID of terminated child, -1 on error"
                errorCodes={["ECHILD", "EINTR"]}
              />
              
              <SystemCall
                name="getpid"
                signature="pid_t getpid(void);"
                description="Get the process ID of the calling process."
                includes={["sys/types.h", "unistd.h"]}
                example={`#include <sys/types.h>
#include <unistd.h>
#include <stdio.h>

pid_t my_pid = getpid();
printf("My PID is: %d\n", my_pid);`}
                returnValue="Always succeeds, returns PID"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="memory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Memory Management
                <Badge variant="secondary">Advanced</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <SystemCall
                name="mmap"
                signature="void *mmap(void *addr, size_t length, int prot, int flags, int fd, off_t offset);"
                description="Map files or devices into memory for efficient access."
                includes={["sys/mman.h", "sys/stat.h", "fcntl.h"]}
                dataStructures={[
                  {
                    name: "Protection flags (prot)",
                    definition: `PROT_READ   - Pages may be read
PROT_WRITE  - Pages may be written  
PROT_EXEC   - Pages may be executed
PROT_NONE   - Pages may not be accessed`
                  },
                  {
                    name: "Mapping flags",
                    definition: `MAP_SHARED    - Share mapping with other processes
MAP_PRIVATE   - Create private copy-on-write mapping
MAP_ANONYMOUS - Map anonymous memory (no file)
MAP_FIXED     - Map at exact address specified`
                  }
                ]}
                example={`#include <sys/mman.h>
#include <fcntl.h>
#include <sys/stat.h>

// Map a file into memory
int fd = open("data.bin", O_RDONLY);
struct stat sb;
fstat(fd, &sb);
void *ptr = mmap(NULL, sb.st_size, PROT_READ, MAP_PRIVATE, fd, 0);
if (ptr == MAP_FAILED) {
    perror("mmap");
}`}
                returnValue="Pointer to mapped area, MAP_FAILED on error"
                errorCodes={["EACCES", "EBADF", "ENOMEM"]}
              />
              
              <SystemCall
                name="munmap"
                signature="int munmap(void *addr, size_t length);"
                description="Unmap a previously mapped memory region."
                includes={["sys/mman.h"]}
                example={`#include <sys/mman.h>

if (munmap(ptr, file_size) == -1) {
    perror("munmap");
}`}
                returnValue="0 on success, -1 on error"
                errorCodes={["EINVAL"]}
              />
              
              <SystemCall
                name="brk"
                signature="int brk(void *addr);"
                description="Change the location of the program break (heap boundary)."
                includes={["unistd.h"]}
                example={`#include <unistd.h>

void *old_brk = sbrk(0);  // Get current break
if (brk(old_brk + 4096) == -1) {  // Extend by 4KB
    perror("brk");
}`}
                returnValue="0 on success, -1 on error"
                errorCodes={["ENOMEM"]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Network Operations
                <Badge variant="secondary">Networking</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <SystemCall
                name="socket"
                signature="int socket(int domain, int type, int protocol);"
                description="Create an endpoint for communication and return a socket descriptor."
                includes={["sys/socket.h", "netinet/in.h", "arpa/inet.h"]}
                dataStructures={[
                  {
                    name: "Domain constants",
                    definition: `AF_INET     - IPv4 Internet protocols
AF_INET6    - IPv6 Internet protocols  
AF_UNIX     - Local communication
AF_PACKET   - Low-level packet interface`
                  },
                  {
                    name: "Type constants",
                    definition: `SOCK_STREAM - TCP (reliable, connection-based)
SOCK_DGRAM  - UDP (unreliable, connectionless)
SOCK_RAW    - Raw socket access`
                  }
                ]}
                example={`#include <sys/socket.h>
#include <netinet/in.h>

// TCP socket
int tcp_sock = socket(AF_INET, SOCK_STREAM, 0);

// UDP socket  
int udp_sock = socket(AF_INET, SOCK_DGRAM, 0);`}
                returnValue="Socket descriptor on success, -1 on error"
                errorCodes={["EAFNOSUPPORT", "EMFILE", "ENOMEM"]}
              />
              
              <SystemCall
                name="bind"
                signature="int bind(int sockfd, const struct sockaddr *addr, socklen_t addrlen);"
                description="Bind a socket to a specific address and port."
                includes={["sys/socket.h", "netinet/in.h", "arpa/inet.h"]}
                dataStructures={[
                  {
                    name: "sockaddr_in structure",
                    definition: `struct sockaddr_in {
    sa_family_t    sin_family; // AF_INET
    in_port_t      sin_port;   // Port (network byte order)
    struct in_addr sin_addr;   // Internet address
    uint8_t        sin_zero[8]; // Padding
};`
                  }
                ]}
                example={`#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

struct sockaddr_in addr;
addr.sin_family = AF_INET;
addr.sin_port = htons(8080);
addr.sin_addr.s_addr = INADDR_ANY;

if (bind(sockfd, (struct sockaddr*)&addr, sizeof(addr)) == -1) {
    perror("bind");
}`}
                returnValue="0 on success, -1 on error"
                errorCodes={["EADDRINUSE", "EACCES", "EBADF"]}
              />
              
              <SystemCall
                name="listen"
                signature="int listen(int sockfd, int backlog);"
                description="Mark socket as passive, ready to accept connections."
                includes={["sys/socket.h"]}
                example={`#include <sys/socket.h>
#include <stdio.h>

if (listen(sockfd, 10) == -1) {
    perror("listen");
    exit(1);
}`}
                returnValue="0 on success, -1 on error"
                errorCodes={["EADDRINUSE", "EBADF", "ENOTSOCK"]}
              />
              
              <SystemCall
                name="accept"
                signature="int accept(int sockfd, struct sockaddr *addr, socklen_t *addrlen);"
                description="Accept a connection on a socket and return new socket for the connection."
                includes={["sys/socket.h", "netinet/in.h"]}
                example={`#include <sys/socket.h>
#include <netinet/in.h>

struct sockaddr_in client_addr;
socklen_t client_len = sizeof(client_addr);
int client_fd = accept(server_fd, (struct sockaddr*)&client_addr, &client_len);
if (client_fd == -1) {
    perror("accept");
}`}
                returnValue="New socket descriptor, -1 on error"
                errorCodes={["EAGAIN", "EBADF", "EINTR"]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Signal Handling
                <Badge variant="secondary">IPC</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <SystemCall
                name="signal"
                signature="sighandler_t signal(int signum, sighandler_t handler);"
                description="Set a signal handler for the specified signal."
                includes={["signal.h"]}
                dataStructures={[
                  {
                    name: "Common signals",
                    definition: `SIGINT  - Interrupt (Ctrl+C)
SIGTERM - Termination request
SIGKILL - Kill (cannot be caught)
SIGCHLD - Child process terminated
SIGUSR1 - User-defined signal 1
SIGUSR2 - User-defined signal 2`
                  },
                  {
                    name: "Special handlers",
                    definition: `SIG_DFL - Default action
SIG_IGN - Ignore signal
SIG_ERR - Error return value`
                  }
                ]}
                example={`#include <signal.h>
#include <stdio.h>
#include <stdlib.h>

void sigint_handler(int sig) {
    printf("Caught SIGINT (signal %d)!\n", sig);
    exit(0);
}

if (signal(SIGINT, sigint_handler) == SIG_ERR) {
    perror("signal");
}`}
                returnValue="Previous handler on success, SIG_ERR on error"
                errorCodes={["EINVAL"]}
              />
              
              <SystemCall
                name="kill"
                signature="int kill(pid_t pid, int sig);"
                description="Send a signal to a process or group of processes."
                includes={["sys/types.h", "signal.h"]}
                dataStructures={[
                  {
                    name: "PID values",
                    definition: `pid > 0  - Send to process with that PID
pid == 0 - Send to all processes in current group  
pid == -1- Send to all processes (except init)
pid < -1 - Send to process group |pid|`
                  }
                ]}
                example={`#include <sys/types.h>
#include <signal.h>

// Send SIGTERM to process 1234
if (kill(1234, SIGTERM) == -1) {
    perror("kill");
}

// Send SIGKILL to current process group
kill(0, SIGKILL);`}
                returnValue="0 on success, -1 on error"
                errorCodes={["EINVAL", "EPERM", "ESRCH"]}
              />
              
              <SystemCall
                name="pause"
                signature="int pause(void);"
                description="Suspend the calling process until a signal is received."
                includes={["unistd.h"]}
                example={`#include <unistd.h>
#include <stdio.h>

printf("Waiting for signal...\n");
pause();  // Blocks until signal received
printf("Signal received!\n");`}
                returnValue="Always returns -1 (after signal handler returns)"
                errorCodes={["EINTR"]}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
