package router

import (
	"os"

	fiber "github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/proxy"
)

func AuthRouter(app *fiber.App) {
	host := os.Getenv("AUTH_HOST")
	auth := app.Group("/auth")
	auth.Use(func(c *fiber.Ctx) error {
		c.Request().Header.Set("Accept", "application/json")
		c.Request().Header.Set("x-forwarded-authorization", "boiIqFmjU8QyCvCm7LBEY09jVwY041jrhG0s47CSF9xsixhddR6WBqwOSC6r3Wxz")
		return c.Next()
	})
	auth.Use("/signup", func(c *fiber.Ctx) error {
		return proxy.Do(c, host+"/api/users")
	})
	auth.Use("/signin", func(c *fiber.Ctx) error {
		return proxy.Do(c, host+"/api/login")
	})

}
