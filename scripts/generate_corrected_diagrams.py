#!/usr/bin/env python3
"""
Generate CORRECTED network architecture diagrams for the Blue Team blog post.
These diagrams show proper network flow and realistic enterprise architecture.
"""

import os
from diagrams import Diagram, Cluster, Edge
from diagrams.generic.network import Switch, Router, Firewall
from diagrams.generic.compute import Rack
from diagrams.onprem.network import Internet
from diagrams.onprem.monitoring import Datadog
from diagrams.onprem.compute import Server

# Create diagrams directory if it doesn't exist
diagrams_dir = "../public/diagrams/network-architecture"
os.makedirs(diagrams_dir, exist_ok=True)

def generate_network_zones_diagram():
    """Generate a CORRECT enterprise network zones diagram showing proper traffic flow"""
    with Diagram(
        "Enterprise Network Zones - Correct Traffic Flow",
        filename=f"{diagrams_dir}/enterprise_zones",
        show=False,
        direction="TB",
        graph_attr={"fontsize": "16", "bgcolor": "white"}
    ):
        # Internet
        internet = Internet("Internet")
        
        # Perimeter security
        perimeter_fw = Firewall("Perimeter\nFirewall")
        perimeter_router = Router("Edge\nRouter")
        
        # DMZ - public-facing services
        with Cluster("DMZ Zone"):
            web_server = Server("Web Server")
            mail_server = Server("Mail Server")
        
        # Internal firewall
        internal_fw = Firewall("Internal\nFirewall")
        
        # Core network infrastructure
        core_switch = Switch("Core Switch")
        
        # Internal zones
        with Cluster("Internal Servers"):
            app_server = Server("Application\nServers")
            database = Server("Database\nServers")
        
        with Cluster("User Network"):
            access_switch = Switch("Access Switch")
            workstations = Rack("User\nWorkstations")
        
        with Cluster("Restricted Zone"):
            restricted_switch = Switch("Restricted Switch")
            finance_server = Server("Finance\nServers")
        
        # CORRECT network flow - users connect through infrastructure to reach internet
        internet >> perimeter_router >> perimeter_fw
        perimeter_fw >> Edge(label="DMZ Traffic") >> web_server
        perimeter_fw >> internal_fw >> core_switch
        
        # Internal connectivity
        core_switch >> access_switch >> workstations
        core_switch >> app_server
        core_switch >> database
        core_switch >> restricted_switch >> finance_server
        
        # Show that users reach internet through the infrastructure
        workstations >> Edge(label="Internet Access", style="dashed", color="blue") >> access_switch

def generate_home_vs_enterprise():
    """Generate corrected home vs enterprise comparison"""
    with Diagram(
        "Home vs Enterprise Network Architecture",
        filename=f"{diagrams_dir}/home_vs_enterprise",
        show=False,
        direction="LR",
        graph_attr={"fontsize": "16", "bgcolor": "white"}
    ):
        # Home network side
        with Cluster("Home Network"):
            home_internet = Internet("Internet")
            home_router = Router("All-in-One\nHome Router\n(Router+Switch+WiFi+Firewall)")
            home_devices = Rack("Home Devices")
            
            home_internet >> home_router >> home_devices
        
        # Enterprise network side
        with Cluster("Enterprise Network"):
            ent_internet = Internet("Internet")
            ent_router = Router("Enterprise\nRouter")
            ent_firewall = Firewall("Enterprise\nFirewall")
            ent_core_switch = Switch("Core\nSwitch")
            ent_access_switch = Switch("Access\nSwitch")
            ent_devices = Rack("Enterprise\nDevices")
            
            ent_internet >> ent_router >> ent_firewall >> ent_core_switch >> ent_access_switch >> ent_devices

def generate_vlan_diagram():
    """Generate a clearer VLAN diagram"""
    with Diagram(
        "VLAN Configuration Example",
        filename=f"{diagrams_dir}/vlan_layout",
        show=False,
        direction="TB",
        graph_attr={"fontsize": "16", "bgcolor": "white"}
    ):
        # Physical switch
        physical_switch = Switch("Physical Switch\n(24 ports)")
        
        # VLANs as logical separations
        with Cluster("VLAN 10 - DMZ"):
            dmz_ports = Rack("Ports 1-4\nWeb Servers")
        
        with Cluster("VLAN 20 - Users"):
            user_ports = Rack("Ports 5-16\nUser Devices")
        
        with Cluster("VLAN 30 - Servers"):
            server_ports = Rack("Ports 17-20\nInternal Servers")
        
        with Cluster("VLAN 99 - Management"):
            mgmt_ports = Rack("Ports 21-24\nManagement")
        
        # Show logical separation
        physical_switch >> Edge(label="VLAN 10", color="red") >> dmz_ports
        physical_switch >> Edge(label="VLAN 20", color="blue") >> user_ports
        physical_switch >> Edge(label="VLAN 30", color="green") >> server_ports
        physical_switch >> Edge(label="VLAN 99", color="orange") >> mgmt_ports

def generate_monitoring_placement():
    """Generate a CORRECT monitoring placement diagram"""
    with Diagram(
        "Network Monitoring Placement",
        filename=f"{diagrams_dir}/monitoring_placement",
        show=False,
        direction="TB",
        graph_attr={"fontsize": "16", "bgcolor": "white"}
    ):
        # Network flow
        internet = Internet("Internet")
        router = Router("Edge Router")
        firewall = Firewall("Firewall")
        core_switch = Switch("Core Switch")
        
        # Monitoring points
        perimeter_tap = Datadog("TAP 1\nPerimeter")
        internal_tap = Datadog("TAP 2\nInternal")
        span_port = Datadog("SPAN Port\nCore Switch")
        
        # Network segments
        dmz_switch = Switch("DMZ Switch")
        user_switch = Switch("User Switch")
        server_switch = Switch("Server Switch")
        
        # Segment monitoring
        dmz_monitor = Datadog("DMZ\nMonitoring")
        user_monitor = Datadog("User\nMonitoring")
        server_monitor = Datadog("Server\nMonitoring")
        
        # Network flow with monitoring
        internet >> perimeter_tap >> router >> firewall >> internal_tap >> core_switch
        core_switch >> span_port
        
        # Segments
        core_switch >> dmz_switch >> dmz_monitor
        core_switch >> user_switch >> user_monitor
        core_switch >> server_switch >> server_monitor

def generate_zero_trust_evolution():
    """Generate simplified zero trust evolution"""
    with Diagram(
        "Traditional vs Zero Trust Security Models",
        filename=f"{diagrams_dir}/zero_trust_evolution",
        show=False,
        direction="LR",
        graph_attr={"fontsize": "16", "bgcolor": "white"}
    ):
        # Traditional model
        with Cluster("Traditional Perimeter Model"):
            trad_internet = Internet("Internet")
            trad_firewall = Firewall("Strong Perimeter\nFirewall")
            trad_network = Rack("Trusted Internal\nNetwork")
            
            trad_internet >> trad_firewall >> trad_network
        
        # Zero trust model
        with Cluster("Zero Trust Model"):
            zt_internet = Internet("Internet")
            zt_gateway = Firewall("Zero Trust\nGateway")
            
            with Cluster("Verified Access Only"):
                zt_app1 = Server("App 1")
                zt_app2 = Server("App 2")
                zt_app3 = Server("App 3")
            
            zt_internet >> zt_gateway
            zt_gateway >> Edge(label="Continuous\nVerification") >> zt_app1
            zt_gateway >> Edge(label="Identity +\nDevice Check") >> zt_app2
            zt_gateway >> Edge(label="Risk-based\nAccess") >> zt_app3

if __name__ == "__main__":
    print("Generating CORRECTED network architecture diagrams...")
    
    print("1. Generating enterprise zones diagram (with correct traffic flow)...")
    generate_network_zones_diagram()
    
    print("2. Generating home vs enterprise comparison...")
    generate_home_vs_enterprise()
    
    print("3. Generating VLAN configuration diagram...")
    generate_vlan_diagram()
    
    print("4. Generating monitoring placement diagram...")
    generate_monitoring_placement()
    
    print("5. Generating zero trust evolution diagram...")
    generate_zero_trust_evolution()
    
    print("All CORRECTED diagrams generated successfully!")
    print(f"Diagrams saved to: {diagrams_dir}")
