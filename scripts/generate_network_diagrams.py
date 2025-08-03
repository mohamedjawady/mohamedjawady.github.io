#!/usr/bin/env python3
"""
Generate network architecture diagrams for the Blue Team blog post
using the Python diagrams library.
"""

import os
from diagrams import Diagram, Cluster, Edge
from diagrams.generic.network import Switch, Router, Firewall, Subnet
from diagrams.generic.compute import Rack
from diagrams.onprem.security import Vault
from diagrams.onprem.network import Internet, HAProxy
from diagrams.onprem.monitoring import Datadog
from diagrams.generic.database import SQL
from diagrams.generic.device import Mobile, Tablet
from diagrams.onprem.compute import Server

# Create diagrams directory if it doesn't exist
diagrams_dir = "../public/diagrams/network-architecture"
os.makedirs(diagrams_dir, exist_ok=True)

def generate_network_zones_diagram():
    """Generate the enterprise network zones diagram"""
    with Diagram(
        "Enterprise Network Zones",
        filename=f"{diagrams_dir}/enterprise_zones",
        show=False,
        direction="TB",
        graph_attr={"fontsize": "20", "bgcolor": "white", "rankdir": "TB"}
    ):
        # Internet zone
        internet = Internet("Internet\n(WAN)")
        perimeter_fw = Firewall("Perimeter\nFirewall")
        
        # DMZ zone with specific services
        with Cluster("DMZ (External Services)", graph_attr={"bgcolor": "lightblue"}):
            web_server = Server("Web Server\n(HTTP/HTTPS)")
            mail_server = Server("Mail Server\n(SMTP/IMAP)")
            dns_server = Server("DNS Server\n(Public DNS)")
        
        # Internal firewall
        internal_fw = Firewall("Internal\nFirewall")
        
        # Internal zones with more detail
        with Cluster("Internal Servers", graph_attr={"bgcolor": "lightgreen"}):
            database = SQL("Database\nServers")
            file_server = Server("File Servers\n(SMB/NFS)")
            app_server = Server("Application\nServers")
            domain_controller = Server("Domain\nController")
        
        with Cluster("User Network", graph_attr={"bgcolor": "lightyellow"}):
            workstation = Rack("Workstations")
            laptop = Mobile("Laptops")
            mobile = Tablet("Mobile Devices")
        
        with Cluster("Restricted Zone", graph_attr={"bgcolor": "lightcoral"}):
            finance_server = Server("Finance\nSystems")
            hr_server = Server("HR Systems")
            backup_server = Server("Backup\nInfrastructure")
        
        with Cluster("IoT/OT Network", graph_attr={"bgcolor": "lightgray"}):
            cameras = Rack("IP Cameras")
            printers = Rack("Network\nPrinters")
            hvac = Rack("HVAC\nSystems")
        
        # Network flow with proper firewall filtering
        internet >> Edge(label="HTTPS/DNS", color="blue") >> perimeter_fw
        perimeter_fw >> Edge(label="Filtered", color="green") >> web_server
        perimeter_fw >> Edge(label="Email", color="green") >> mail_server
        perimeter_fw >> Edge(label="DNS", color="green") >> dns_server
        
        web_server >> Edge(label="DB Queries", color="orange") >> internal_fw
        internal_fw >> Edge(label="Authenticated", color="green") >> database
        
        internal_fw >> Edge(label="User Traffic", color="blue") >> workstation
        workstation >> Edge(label="Limited Access", color="orange") >> finance_server
        workstation >> Edge(label="IoT Segment", color="red", style="dashed") >> cameras

def generate_vlan_physical_vs_logical():
    """Generate VLAN physical vs logical layout diagram"""
    with Diagram(
        "VLAN Physical vs Logical Separation",
        filename=f"{diagrams_dir}/vlan_layout",
        show=False,
        direction="LR",
        graph_attr={"fontsize": "20", "bgcolor": "white", "rankdir": "LR"}
    ):
        # Physical infrastructure
        with Cluster("Physical Infrastructure", graph_attr={"bgcolor": "lightgray"}):
            physical_switch = Switch("Managed Switch\n48 Ports")
            
            # Physical connections
            with Cluster("Physical Ports"):
                port1 = Rack("Port 1\nWeb Server")
                port2 = Rack("Port 2\nWorkstation A")
                port3 = Rack("Port 3\nDB Server")
                port4 = Rack("Port 4\nWorkstation B")
                port5 = Rack("Port 5\nMail Server")
                port6 = Rack("Port 6\nLaptop")
        
        # Logical VLAN separation
        with Cluster("VLAN 10 - DMZ (203.0.113.0/28)", graph_attr={"bgcolor": "lightblue"}):
            vlan10_devices = [
                Server("Web Server\n(Port 1)"),
                Server("Mail Server\n(Port 5)")
            ]
        
        with Cluster("VLAN 20 - Users (192.168.1.0/24)", graph_attr={"bgcolor": "lightyellow"}):
            vlan20_devices = [
                Rack("Workstation A\n(Port 2)"),
                Rack("Workstation B\n(Port 4)"),
                Mobile("Laptop\n(Port 6)")
            ]
        
        with Cluster("VLAN 30 - Servers (10.0.1.0/24)", graph_attr={"bgcolor": "lightgreen"}):
            vlan30_devices = [
                SQL("Database Server\n(Port 3)")
            ]
        
        # Show logical connections
        physical_switch >> Edge(label="VLAN 10", color="blue", style="dashed") >> vlan10_devices[0]
        physical_switch >> Edge(label="VLAN 10", color="blue", style="dashed") >> vlan10_devices[1]
        physical_switch >> Edge(label="VLAN 20", color="orange", style="dashed") >> vlan20_devices[0]
        physical_switch >> Edge(label="VLAN 20", color="orange", style="dashed") >> vlan20_devices[1]
        physical_switch >> Edge(label="VLAN 20", color="orange", style="dashed") >> vlan20_devices[2]
        physical_switch >> Edge(label="VLAN 30", color="green", style="dashed") >> vlan30_devices[0]

def generate_monitoring_placement():
    """Generate strategic monitoring placement diagram"""
    with Diagram(
        "Strategic Network Monitoring Placement",
        filename=f"{diagrams_dir}/monitoring_placement",
        show=False,
        direction="TB",
        graph_attr={"rankdir": "TB", "bgcolor": "white", "fontsize": "20"}
    ):
        # Internet and perimeter monitoring
        internet = Internet("Internet")
        perimeter_tap = Datadog("Perimeter\nTAP")
        firewall = Firewall("Perimeter\nFirewall")
        internal_tap = Datadog("Internal\nTAP")
        core_switch = Switch("Core Switch")
        span_monitor = Datadog("SPAN Port\nMonitoring")
        
        # Network flow with monitoring points
        internet >> Edge(label="All Traffic", color="red") >> perimeter_tap
        perimeter_tap >> Edge(label="Copy", style="dashed", color="red") >> firewall
        firewall >> Edge(label="Filtered Traffic", color="orange") >> internal_tap
        internal_tap >> Edge(label="Copy", style="dashed", color="orange") >> core_switch
        core_switch >> Edge(label="Aggregate", color="blue") >> span_monitor
        
        # Network segments with monitoring
        with Cluster("User VLAN (192.168.1.0/24)", graph_attr={"bgcolor": "lightyellow"}):
            user_switch = Switch("User Switch")
            user_devices = Rack("User Devices")
            user_tap = Datadog("Inline TAP")
            
            user_switch >> user_devices
            user_switch >> Edge(label="Mirror", style="dashed", color="green") >> user_tap
        
        with Cluster("Server VLAN (10.0.1.0/24)", graph_attr={"bgcolor": "lightgreen"}):
            server_switch = Switch("Server Switch")
            servers = Server("Critical Servers")
            server_span = Datadog("SPAN Monitor")
            
            server_switch >> servers
            server_switch >> Edge(label="SPAN", style="dashed", color="blue") >> server_span
        
        with Cluster("DMZ VLAN (203.0.113.0/28)", graph_attr={"bgcolor": "lightblue"}):
            dmz_switch = Switch("DMZ Switch")
            dmz_servers = Server("DMZ Servers")
            dmz_tap = Datadog("DMZ TAP")
            
            dmz_switch >> dmz_servers
            dmz_switch >> Edge(label="TAP", style="dashed", color="purple") >> dmz_tap
        
        with Cluster("Restricted VLAN (10.0.100.0/24)", graph_attr={"bgcolor": "lightcoral"}):
            restricted_switch = Switch("Restricted Switch")
            restricted_servers = Server("Sensitive Systems")
            restricted_monitor = Datadog("Deep Inspection")
            
            restricted_switch >> restricted_servers
            restricted_switch >> Edge(label="Full Capture", style="dashed", color="red") >> restricted_monitor
        
        # Connect segments to core
        core_switch >> Edge(color="green") >> user_switch
        core_switch >> Edge(color="blue") >> server_switch
        core_switch >> Edge(color="purple") >> dmz_switch
        core_switch >> Edge(color="red") >> restricted_switch

def generate_home_vs_enterprise():
    """Generate home router vs enterprise comparison"""
    with Diagram(
        "Home Router vs Enterprise Network",
        filename=f"{diagrams_dir}/home_vs_enterprise",
        show=False,
        direction="TB",
        graph_attr={"fontsize": "20", "bgcolor": "white"}
    ):
        # Home network
        with Cluster("Home Network (All-in-One)"):
            home_internet = Internet("Internet")
            home_router = Router("Home Router\n(Firewall + Router +\nSwitch + WiFi)")
            home_devices = Rack("Home Devices")
            
            home_internet >> home_router >> home_devices
        
        # Enterprise network
        with Cluster("Enterprise Network (Dedicated Components)"):
            enterprise_internet = Internet("Internet")
            enterprise_firewall = Firewall("Dedicated\nFirewall")
            enterprise_router = Router("Enterprise\nRouter")
            enterprise_switch = Switch("Managed\nSwitch")
            enterprise_devices = Rack("Enterprise\nDevices")
            
            enterprise_internet >> enterprise_firewall >> enterprise_router >> enterprise_switch >> enterprise_devices

def generate_zero_trust_evolution():
    """Generate Zero Trust architecture evolution diagram"""
    with Diagram(
        "Zero Trust Architecture Evolution",
        filename=f"{diagrams_dir}/zero_trust_evolution",
        show=False,
        direction="TB",
        graph_attr={"fontsize": "20", "bgcolor": "white", "rankdir": "TB"}
    ):
        # Traditional perimeter model
        with Cluster("Traditional Perimeter Model", graph_attr={"bgcolor": "lightcoral"}):
            traditional_internet = Internet("Internet\n(Untrusted)")
            traditional_firewall = Firewall("Strong Perimeter\nFirewall")
            
            with Cluster("Trusted Internal Network"):
                traditional_servers = Server("Internal Servers\n(Implicit Trust)")
                traditional_users = Rack("Internal Users\n(Full Access)")
                traditional_admin = Rack("Admin Systems\n(High Privilege)")
            
            traditional_internet >> Edge(label="Block All", color="red") >> traditional_firewall
            traditional_firewall >> Edge(label="Allow All", color="green") >> traditional_servers
            traditional_servers >> Edge(label="Unrestricted", color="green") >> traditional_users
            traditional_users >> Edge(label="Lateral Movement", color="orange") >> traditional_admin
        
        # Zero Trust model
        with Cluster("Zero Trust Model", graph_attr={"bgcolor": "lightgreen"}):
            zt_internet = Internet("Internet\n(Any Network)")
            zt_gateway = Vault("Identity &\nAccess Proxy")
            
            with Cluster("Verified Access Only"):
                zt_app1 = Server("Finance App\n(MFA Required)")
                zt_app2 = Server("HR System\n(Device Cert)")
                zt_app3 = Server("Dev Environment\n(Risk-Based)")
                zt_monitor = Datadog("Continuous\nMonitoring")
            
            # Zero trust connections with verification
            zt_internet >> Edge(label="Any Location", color="blue") >> zt_gateway
            zt_gateway >> Edge(label="Multi-Factor\nAuth", color="green") >> zt_app1
            zt_gateway >> Edge(label="Device Certificate\n+ Context", color="green") >> zt_app2
            zt_gateway >> Edge(label="Risk Assessment\n+ Behavior", color="green") >> zt_app3
            
            # Continuous monitoring
            zt_app1 >> Edge(label="Session Monitoring", style="dashed", color="purple") >> zt_monitor
            zt_app2 >> Edge(label="Activity Logs", style="dashed", color="purple") >> zt_monitor
            zt_app3 >> Edge(label="Threat Detection", style="dashed", color="purple") >> zt_monitor

if __name__ == "__main__":
    print("Generating network architecture diagrams...")
    
    print("1. Generating enterprise zones diagram...")
    generate_network_zones_diagram()
    
    print("2. Generating VLAN layout diagram...")
    generate_vlan_physical_vs_logical()
    
    print("3. Generating monitoring placement diagram...")
    generate_monitoring_placement()
    
    print("4. Generating home vs enterprise comparison...")
    generate_home_vs_enterprise()
    
    print("5. Generating zero trust evolution diagram...")
    generate_zero_trust_evolution()
    
    print("All diagrams generated successfully!")
    print(f"Diagrams saved to: {diagrams_dir}")
