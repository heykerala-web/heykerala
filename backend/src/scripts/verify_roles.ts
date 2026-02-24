const API_URL = "http://localhost:5000/api";

async function verify() {
    console.log("🚀 Starting Verification...");

    try {
        // 1. Verify Registration Validation (Fail Admin)
        console.log("\n🧪 Testing Registration (Reject Admin)...");
        const adminRes = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Fake Admin",
                email: `admin_test_${Date.now()}@example.com`,
                password: "password123",
                role: "Admin"
            })
        });
        const adminData: any = await adminRes.json();
        if (adminRes.status === 400) {
            console.log("✅ Success: Registration as Admin failed as expected:", adminData.message);
        } else {
            console.log("❌ Error: Registration as Admin should have failed with 400, but got", adminRes.status);
        }

        // 2. Verify Registration (Success Contributor)
        console.log("\n🧪 Testing Registration (Success Contributor)...");
        const regRes = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Test Contributor",
                email: `contributor_${Date.now()}@example.com`,
                password: "password123",
                role: "Contributor"
            })
        });
        const regData: any = await regRes.json();
        if (regRes.status === 201) {
            console.log(`✅ Success: Registered as ${regData.user.role}`);
        } else {
            console.log("❌ Error: Registration failed with", regRes.status, regData.message);
            return;
        }

        const { token } = regData;
        const authHeaders = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };

        // 3. Verify RBAC (Allowed)
        console.log("\n🧪 Testing RBAC (Allowed for Contributor)...");
        const subRes = await fetch(`${API_URL}/places/user/submission`, {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify({ name: "Test Place" })
        });
        if (subRes.status !== 403) {
            console.log("✅ Success: Passed RBAC middleware (status:", subRes.status, ")");
        } else {
            const subData: any = await subRes.json();
            console.log("❌ Error: RBAC failed for Contributor!", subData.message);
        }

        // 4. Verify Role Switch (To Tourist)
        console.log("\n🧪 Testing Role Switch (Contributor -> Tourist)...");
        const switchRes = await fetch(`${API_URL}/auth/role`, {
            method: "PATCH",
            headers: authHeaders,
            body: JSON.stringify({ role: "Tourist" })
        });
        const switchData: any = await switchRes.json();
        if (switchRes.status === 200) {
            console.log(`✅ Success: Switched to ${switchData.user.role}`);
        } else {
            console.log("❌ Error: Role switch failed!", switchData.message);
            return;
        }

        // 5. Verify RBAC (Denied for Tourist)
        console.log("\n🧪 Testing RBAC (Denied for Tourist)...");
        const subRes2 = await fetch(`${API_URL}/places/user/submission`, {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify({ name: "Test Place" })
        });
        const subData2: any = await subRes2.json();
        if (subRes2.status === 403) {
            console.log("✅ Success: RBAC correctly denied Tourist submission:", subData2.message);
        } else {
            console.log("❌ Error: Expected 403 but got", subRes2.status);
        }

        console.log("\n✨ Verification Complete!");

    } catch (error: any) {
        console.error("❌ Verification Failed:", error.message);
    }
}

verify();
