---
layout:
  title:
    visible: true
  description:
    visible: false
  tableOfContents:
    visible: true
  outline:
    visible: true
  pagination:
    visible: true
---

# Docs

## App Class

```cpp
class App {
public:
	Drizzle3D_API App(char* WindowName, int width, int height);

	Drizzle3D_API bool Run();

	Window* window();
	std::shared_ptr<ImGuiLayer> ImguiLayer();
	std::shared_ptr<RenderingLayer> GetRenderingLayer();
	std::shared_ptr<RenderingLayer2D> GetRenderingLayer2D();
	std::shared_ptr<ResourceManager> GetResourceManager();
	EventDispatcher* dispatcher();

private:
	std::shared_ptr<ResourceManager> resourcemgr;
	Window D3DWindow;
	std::shared_ptr<ImGuiLayer> imguilayer;
	std::shared_ptr<RenderingLayer> renderinglayer;
	std::shared_ptr<RenderingLayer2D> renderinglayer2d;
	EventDispatcher dispatch;
	LayerDispatch LayerDispatcher;
};
```

### Creating the App Class

To create the App Class, use:

```cpp
std::shared_ptr<Drizzle3D::App> app = std::make_shared<Drizzle3D::App>();
```

### Main Loop

To use the main Loop use:

```cpp
while (app->Run()) {
    // Update Code
}
```

### Returning Window

```cpp
app->window();
```

### Returning ImGui Layer

```cpp
app->ImguiLayer();
```

### Returning Rendering Layer

```cpp
app->GetRenderingLayer();
```

### Returning Rendering Layer 2D

```cpp
app->GetRenderingLayer2D();
```

### Returning Resource Manager

```cpp
app->GetResourceManager();
```

### Returning Event Dispatcher

```cpp
app->dispatcher();
```

### Example Code

```cpp
#include <iostream>
#include "Drizzle3D.h"

int main() {

    /*
    * NOTE:
    * Key Released and Mouse Released
    */
    std::shared_ptr<Drizzle3D::App> app = std::make_shared<Drizzle3D::App>();
    
    while (app->Run()) {
        // Update Code
    }

    return 0;
}
```

## Event Class

```cpp
class Event {
public:
    virtual ~Event() = default;

    bool Handled = false;

    virtual EventType GetEventType() = 0;
};
```

### Returning Event Type from Event Class

```cpp
event->GetEventType();
```

### Returning Handled bool

```cpp
event->Handled;
```

## Event Dispatcher

```cpp
class EventDispatcher {
public:
    EventDispatcher(const EventDispatcher&) = delete;
    EventDispatcher& operator=(const EventDispatcher&) = delete;
    EventDispatcher() = default;
    EventDispatcher& operator=(EventDispatcher&&) = default;
    EventDispatcher(EventDispatcher&&) = default;
    typedef void (*EventCallback)(GLFWwindow* app, std::unique_ptr<Event> events, std::any);
    void AddEvent(std::unique_ptr<Event> newEvent);
    std::unique_ptr<Event> GetEvent(EventType eventType);
    void RemoveHandledEvents();
    bool isUnhandledEvent(EventType eventType);
    void ResetEvents() { events.clear(); }
    void AddEventListener(EventType eventType, EventCallback callback, std::any a = NULL);
    void RemoveEventListener(EventType eventType, EventCallback callback);
    void DispatchEvent(GLFWwindow* window);
private:
    std::vector<std::unique_ptr<Event>> events;
    std::unordered_map<EventType, std::vector<std::pair<EventCallback, std::any>>> eventCallbacks;
    Logging log;
};
```

### Adding Events

To fake an Event or add a Virtual Event use:

```cpp
app->dispatcher()->AddEvent(std::make_unique<WindowResizeEvent>(10, 73));
```

### Getting an Event

To know if an unhandled event exists (eg: button press, mouse move, etc) use:

```cpp
app->dispatcher()->IsUnhandledEvent(EventType::WindowClose);
```

### Adding an Event Listener

```cpp
void Closed(GLFWwindow* window, std::unique_ptr<Drizzle3D::Event> ev, std::any a) {
    std::cout << "Closeda";
}

app->dispatcher()->AddEventListener(EventType::WindowClose, callbackfunc, 3)
```

### Removing an Event Listener

```cpp
void Closed(GLFWwindow* window, std::unique_ptr<Drizzle3D::Event> ev, std::any a) {
    std::cout << "Closeda";
}

app->dispatcher()->RemoveEventListener(EventType::WindowClose, callbackfunc)
```

## Flags

```cpp
class Flags {
public:
	Flags() {}

	void AddFlag(const std::string& name, bool& pointer);

        void ChangeFlag(const std::string& name, const bool newValue);

	bool GetFlag(const std::string& name);

private:
	std::map<std::string, bool*> flagMap;
	Logging log;
};
```

### Adding a Flag

```cpp
Flag flag;
bool bol = true;
flag.AddFlag("NewFlag", bol);
```

### Changing a Flag

```cpp
Flag flag;
bool bol = true;
flag.AddFlag("NewFlag", bol);
flag.ChangeFlag("NewFlag", false);
```

### Getting a Flag

```cpp
Flag flag;
bool bol = true;
flag.AddFlag("NewFlag", bol);
bool hd = flag.GetFlag("NewFlag");
```

## ImGui Layer

```cpp
class ImGuiLayer : public Layer {
public:
    ImGuiLayer(Window* window) : name("ImGUI"), show(true), pWindow(window) {}

    typedef void (*ImGUICode)(std::shared_ptr<ImGuiLayer> igui);

    ImGUICode code = [](std::shared_ptr<ImGuiLayer> igui) {};

    void OnAttach() override;
    void OnDetach() { }
    void Render() override;

    bool IsShown() const override { return show; }
    const std::string& GetName() const override { return name; }
    void SetShow(bool value) override { show = value; }
    void setIGUI(std::shared_ptr<ImGuiLayer> ig) { igui = ig; }
    void IterateSliderFloat();
    void GUISliderFloat(const char* label, float* v, float v_min, float v_max, const char* format = NULL, int flags = NULL);
    ImGuiContext* imguiContext = NULL;

private:
    bool show;
    std::string name;
    Window* pWindow;
    std::shared_ptr<ImGuiLayer> igui;
    std::vector<SliderFloat> SliderFloats;
};
```

### Adding ImGui Code

Create your function:

```cpp
void ImGUICode(std::shared_ptr<Drizzle3D::ImGuiLayer> rend) {
    // Code Here
}
```

Then Set ImGui Context:

```cpp
void ImGUICode(std::shared_ptr<Drizzle3D::ImGuiLayer> rend) {
    ImGui::SetCurrentContext(rend->imguiContext);
    // Code Here
}
```

Then pass the function to the ImGuiLayer.

```cpp
app->ImguiLayer()->code = ImGUICode;
```

## Rendering Layer

```cpp
std::pair<std::vector<float>, std::vector<unsigned int>> LoadObjFile(const std::string& filePath);
GLuint GetTexture(const char* texturePath);

enum Lights {
    Directional,
    Point
};

struct Light {
    glm::vec3 direction;
    glm::vec3 position;
    glm::vec3 color;
    float strength;
    float SpecularStrength;

    glm::vec3 ambient;
    glm::vec3 diffuse;
    glm::vec3 specular;

    Lights type;
    int id;

    float constant;
    float linear;
    float quadratic;
};

struct Object {
    GLuint VertexArray, VertexBuffer, IndexBuffer = 0;
    std::vector<float> vertices;
    std::vector<unsigned int> indices;
    glm::mat4 modelMatrix;
    GLuint textureID = NULL;
    GLuint mat = 0;
    char* name = (char*)"PLZ_SPECIFY_A_NAME";
};

struct Camera {
    glm::vec3 position;
    glm::vec3 look_at_position;
    glm::vec3 up;
    char* ID;
};

class RenderingLayer : public Layer {
public:
    RenderingLayer(Window* window, std::shared_ptr<ResourceManager> resmgr);

    void OnAttach() override;
    void OnDetach() override {}
    void Render() override;

    bool IsShown() const override { return show; }
    const std::string& GetName() const override { return name; }
    void SetShow(bool value) override { show = value; }

    void Create_Shader(const char* vertexShaderSource, const char* fragmentShaderSource);
    Object DrawVerts(std::pair<std::vector<float>, std::vector<unsigned int>> vf, glm::mat4 modelMatrix = glm::mat4(1.0f));
    void AddObject(const char* name, Object theObject);
    Object* returnObject(const char* name);
    void RemoveObject(const char* name);
    void AddLight(float id, Light theLight);
    Light* returnLight(float id);
    void RemoveLight(float id);
    void SwitchCamera(const char* name);
    void AddCamera(const char* id, Camera theCamera);
    Camera* returnCamera(const char* id);
    void RemoveCamera(const char* id);
    char* GetActiveCamera() { return current_camera; }
    Camera ReturnActiveCamera();
    Camera GetCameraFromID(char* cam);
    Flags* GetFlags() { return &flags; }
    void InitGlRendering();
    void RenderInitGlRendering();
    void DrawVertGLRendering(Object &myOBJ);
    void InitVulkanRendering();
    void RenderInitVulkanRendering();
    void DrawVertVulkanRendering(Object& myOBJ);
private:
    bool Lighting = true;
    bool fullscreen = false;
    bool UseOpenGL = true;
    bool UseVulkan = false;
    bool UseOLDOpenGL = true;
    bool UseOLDVulkan = false;
    bool show;
    GLuint shaderProgram = 0;
    GLuint OldshaderProgram = 0;
    std::string name;
    Window* pWindow;
    std::vector<Object> Objects;
    std::vector<Light> Lights;
    std::vector<Camera> Cameras;
    Flags flags;

    GLuint lightsBuffer = 0;
    char* current_camera = (char*)"Default";
    std::shared_ptr<ResourceManager> resourcemgr;
    Logging log;
};
```

### Add Object

```cpp
glm::mat4 modelMatrix = glm::mat4(1.0f);
app->GetRenderingLayer()->AddObject("TestObject", app->GetRenderingLayer()->DrawVerts(Drizzle3D::LoadObjFile("TestObject.obj"), modelMatrix));
```

### Return Object

```cpp
Object* obj = app->GetRenderingLayer()->returnObject("TestObject");
```

### Remove Object

```cpp
app->GetRenderingLayer()->RemoveObject("TestObject");
```

### Flags

```cpp
app->GetRenderingLayer()->GetFlags->ChangeFlag("Lighting", true); // Enable or Disable Lighting Effects
app->GetRenderingLayer()->GetFlags->ChangeFlag("Fullscreen", true); // Enable or Disable Fullscreen Window
app->GetRenderingLayer()->GetFlags->ChangeFlag("Show", true); // Show or Hide 3D Rendering Layer
app->GetRenderingLayer()->GetFlags->ChangeFlag("UseOpenGL", true); // Enable or Disable OpenGL
app->GetRenderingLayer()->GetFlags->ChangeFlag("UseVulkan", false); // Enable or Disable experimental Vulkan
```

### Add Light

```cpp
Light pointLight;

pointLight.type = Lights::Point;
pointLight.id = 1;  // Set an appropriate ID

// Set position for a point light
pointLight.position = glm::vec3(0.0f, 5.0f, 0.0f);

// Set color and intensity
pointLight.color = glm::vec3(1.0f, 1.0f, 1.0f); // white light
pointLight.strength = 1.0f;
pointLight.SpecularStrength = 1.0f;

// Set lighting components
pointLight.ambient = glm::vec3(0.1f, 0.1f, 0.1f);
pointLight.diffuse = glm::vec3(0.8f, 0.8f, 0.8f);
pointLight.specular = glm::vec3(1.0f, 1.0f, 1.0f);

// Set attenuation parameters for the point light
pointLight.constant = 1.0f;
pointLight.linear = 0.09f;
pointLight.quadratic = 0.032f;

app->GetRenderingLayer()->AddLight(1, pointLight); // 1 is the ID
```

### Return Light

```cpp
Light* light = app->GetRenderingLayer()->returnLight(1); // 1 is the ID
```

### Remove Light

```cpp
app->GetRenderingLayer()->RemoveLight(1); // 1 is the ID
```

### Add Camera

```cpp
Drizzle3D::Camera aCamera = { glm::vec3(0.0f, 0.0f, 3.0f), glm::vec3(0.0f, 0.0f, 0.0f), glm::vec3(0.0f, 1.0f, 0.0f) };
camera_pos = glm::vec3(0.0f, 0.0f, 3.0f);
camera_up_pos = glm::vec3(0.0f, 1.0f, 0.0f);
app->GetRenderingLayer()->AddCamera("AcamID", aCamera);
```

### Return Camera

```cpp
Camera* cam = app->GetRenderingLayer()->returnCamera("AcamID");
```

### Return Active Camera

```cpp
Camera cam = app->GetRenderingLayer()->ReturnActiveCamera();
```

### Return Active Camera ID

```cpp
char* camID = app->GetRenderingLayer()->GetActiveCamera();
```

### Remove Camera

```cpp
app->GetRenderingLayer()->RemoveCamera("AcamID");
```

### Switch Camera

```cpp
app->GetRenderingLayer()->SwitchCamera("AcamID");
```

## Material

```cpp
class Material {
public:
	Material(std::shared_ptr<ResourceManager> resourcemgr, const char* fname, const char* fgname); // Fragment Shader/"fname" and Vertex Shader/"fgname"
	GLuint GetShaderProgram() { return shaderProgram; }
private:
	GLuint shaderProgram;
};
```

## Skybox

```
class Skybox {
public:
	Drizzle3D_API Skybox(std::shared_ptr<App> app, const char* skyboxtex, float size = 100.0f);
	Drizzle3D_API void Update();

private:
	std::shared_ptr<App> application;
	glm::vec3 pos;
};

// Example

Skybox sky(app, "skybox.png");
```

## First Person Camera

```cpp
class FirstPersonCamera {
public:
	Drizzle3D_API FirstPersonCamera(std::shared_ptr<App> app);

	glm::vec3 position = glm::vec3(0, 0, 5);
	float horizontalAngle = 0.0f;
	float verticalAngle = 0.0f;
	float initialFoV = 450.0f;

	float speed = 1.0f; // 3 units / second
	float mouseSpeed = 0.005f;
	std::shared_ptr<App> application;
	bool capture = true;
	double xpos, ypos = 0.0;
};

// Example
FirstPersonCamera fpc(app);
```

### Changing Camera Position

```cpp
FirstPersonCamera fpc(app);
fpc.position = glm::vec3(0, 0, 15);
```

### Reading Camera Position

```cpp
FirstPersonCamera fpc(app);
glm::vec3 s = fpc.position;
```

### Changing Horizontal Angle

```cpp
FirstPersonCamera fpc(app);
fpc.horizontalAngle = 0.9f;
```

### Reading Horizontal Angle

```cpp
FirstPersonCamera fpc(app);
float s = fpc.horizontalAngle;
```

### Changing Vertical Angle

```cpp
FirstPersonCamera fpc(app);
fpc.verticalAngle = 0.9f;
```

### Reading Vertical Angle

```cpp
FirstPersonCamera fpc(app);
float s = fpc.verticalAngle;
```

### Changing Initial FOV

```cpp
FirstPersonCamera fpc(app);
fpc.initialFoV = 500.0f;
```

### Reading Initial FOV

```cpp
FirstPersonCamera fpc(app);
float s = fpc.initialFoV;
```

### Changing Movement Speed

```cpp
FirstPersonCamera fpc(app);
fpc.speed = 0.9f;
```

### Reading Movement Speed

```cpp
FirstPersonCamera fpc(app);
float s = fpc.speed;
```

### Capturing Mouse Cursor

```cpp
FirstPersonCamera fpc(app);
fpc.capture = true;
```

## Layers

```cpp
class Layer {
public:
    Drizzle3D_API Layer() {}

    Drizzle3D_API Layer(Window* window) : name("Layer"), pWindow(window) {}

    Drizzle3D_API virtual ~Layer() = default;
    Drizzle3D_API virtual void OnAttach() { }
    Drizzle3D_API virtual void OnDetach() { }
    Drizzle3D_API virtual void Render() { }

    Drizzle3D_API virtual bool IsShown() const { return show; }
    Drizzle3D_API virtual const std::string& GetName() const { return name; }
    Drizzle3D_API virtual void SetShow(bool value) { show = value; }
private:
    bool show = false;
    std::string name;
    Window* pWindow = NULL;
};
```

### IsShown

```cpp
bool s = TestLayer.IsShown();
```

### GetName

```cpp
std::string s = TestLayer.GetName();
```

### SetShow

```cpp
TestLayer.SetShow(false);
```

### Example Code

```cpp
class TestLayer : public Layer {
public:
    Drizzle3D_API TestLayer(Window* window, std::shared_ptr<ResourceManager> resmgr);

    Drizzle3D_API void OnAttach() override;
    Drizzle3D_API void OnDetach() override {}
    Drizzle3D_API void Render() override;

    Drizzle3D_API bool IsShown() const override { return show; }
    Drizzle3D_API const std::string& GetName() const override { return name; }
    Drizzle3D_API void SetShow(bool value) override { show = value; }

    Drizzle3D_API Flags* GetFlags() { return &flags; }
private:
    bool show;
    Flags flags;
    std::string name;
    Window* pWindow;
    std::shared_ptr<ResourceManager> resourcemgr;
    Logging log;
};
```

## Layer Dispatcher

```cpp
class LayerDispatch {
public:
    void AddLayer(std::shared_ptr<Layer> layer);
    void RemoveLayerByName(const std::string& name);
    void ShowHideLayerByName(const std::string& name, bool show);
    void PushFront(const std::string& name);
    void PushForward(const std::string& name);
    void PushBack(const std::string& name);
    void PushBackward(const std::string& name);

    void DispatchLayerRender();
    void DispatchLayerDetach();
    void DispatchLayerAttach();

private:
    std::vector<std::shared_ptr<Layer>> layers;
};
```

### Moving Layers

To Push a Layer Back by 1, do:

```cpp
app->Layerdispatcher()->PushBackward("TestLayer") // Can Also Be RenderingLayer/"3DLayer" or ImGuiLayer/"ImGui"
```

To Push a Layer to the very Back, do:

```cpp
app->Layerdispatcher()->PushBack("TestLayer") // Can Also Be RenderingLayer/"3DLayer" or ImGuiLayer/"ImGui"
```

To Push a Layer Back by 1, do:

```cpp
app->Layerdispatcher()->PushForward("TestLayer") // Can Also Be RenderingLayer/"3DLayer" or ImGuiLayer/"ImGui"
```

To Push a Layer to the very Back, do:

```cpp
app->Layerdispatcher()->PushFront("TestLayer") // Can Also Be RenderingLayer/"3DLayer" or ImGuiLayer/"ImGui"
```

### Show or Hide Layer By Name

```cpp
app->Layerdispatcher()->ShowHideLayerByName("TestLayer", false) // Can Also Be True to Show Layer
```

### Add Layer

```cpp
app->Layerdispatcher()->AddLayer(Testlayer);
```

### Remove Layer

```cpp
app->Layerdispatcher()->RemoveLayerByName("TestLayer");
```

## Logging

```cpp
class Logging {
public:
	Logging() {}

	void Error(std::string message, std::string who = "[Drizzle3D::Core] ");
	void Warning(std::string message, std::string who = "[Drizzle3D::Core] ");
	void Info(std::string message, std::string who = "[Drizzle3D::Core] ");
};
```

### Logging an Error

```cpp
Logging log;
log.Error("Error!");
```

or

```cpp
Logging log;
log.Error("Error!", "[ExampleGame]");
```

### Logging an Warning

```cpp
Logging log;
log.Warning("Warning!");
```

or

```cpp
Logging log;
log.Warning("Warning!", "[ExampleGame]");
```

### Logging an Info

```cpp
Logging log;
log.Info("Info!");
```

or

```cpp
Logging log;
log.Info("Info!", "[ExampleGame]");
```

## Resource Manager

```cpp
struct Resource {
	std::string content;
	const char mode[2];
};

class ResourceManager {
public:
	Resource loadFile(const std::string& filePath, const char mode[2]);

	bool fileExists(const std::string& filePath) const;

	void writeFile(const std::string& filePath, const std::string& content);

	std::string& getTempFileContent(const std::string& filePath);
private:
	std::unordered_map<std::string, std::string> resources;
};
```

### Reading a File

```cpp
ResourceManager resman;
std::cout << resman.loadFile("text.txt", "r").content; // r for read
```

### Writing to a File

```cpp
ResourceManager resman;
Resource res = resman.loadFile("text.txt", "w"); // w for write
res.content += "TEST!";
resman.writeFile("text.txt", res.content);
```

### Check if file is cached

```cpp
ResourceManager resman;
bool exists = resman.fileExists("text.txt");
```

## Window

```cpp
class Window {
public:
	Window(EventDispatcher* dispatch, char* WindowName = (char*)"New Drizzle3D Game", int width = 800, int height = 600);
	~Window();

	GLFWwindow* returnwindow();
	int returnWidth();
	int returnHeight();
	int returnX();
	int returnY();
	std::vector<int> returnKeyPressedCodes() { return key_codes; }
	void clearKeyCodes() { key_codes.clear(); }
	std::vector<int> returnKeyReleasedCodes() { return keyRel_codes; }
	void clearKeyReleasedCodes() { keyRel_codes.clear(); }
	double returnMouseX() { return lastMouseX; }
	double returnMouseY() { return lastMouseY; }

	void ProcessEvents();
	void Render();

	EventDispatcher* dispatcher;
private:
	GLFWwindow* window = NULL;
	int winwidth;
	int winheight;
	int winx;
	int winy;
	std::vector<int> key_codes;
	std::vector<int> keyRel_codes;
	bool wasLeftMouseButtonPressed = false;
	bool wasRightMouseButtonPressed = false;
	double lastMouseX = 0.0;
	double lastMouseY = 0.0;
	double lastSMouseX = 0.0;
	double lastSMouseY = 0.0;
};
```

### Getting GLFW Window

```cpp
GLFWWindow* wind = app->window()->returnwindow();
```

### Getting Window height

```cpp
int height = app->window()->returnHeight();
```

### Getting Window Width

```cpp
int width = app->window()->returnWidth();
```

### Getting Window X

```cpp
int x = app->window()->returnX();
```

### Getting Window Y

```cpp
int y = app->window()->returnY();
```
